import { describe, expect, it, setDefaultTimeout } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";
import { Result } from "true-myth";
import { TallyVmAdapter, callVm } from "./index.js";
import { WasmModuleCache } from "./services/wasm-module-cache.js";
import { createWasmModule } from "./services/wasm-module.js";
import {
	type HttpFetchAction,
	HttpFetchResponse,
	type ProxyHttpFetchAction,
} from "./types/vm-actions.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import type { VmCallData } from "./types/vm-call-data.js";
import { PromiseStatus } from "./types/vm-promise.js";
import {
	type VmActionExecuteMessage,
	WorkerMessageType,
} from "./types/worker-messages.js";
import { HostToWorker } from "./worker-host-communication.js";

setDefaultTimeout(30_000);

// This file also runs from the compiled dist output (bun test matches both
// copies), where modules are .js and the repo layout sits one level deeper.
function firstExisting(candidates: string[]): string {
	const found = candidates.find((candidate) => existsSync(candidate));
	if (!found) {
		throw new Error(
			`None of the candidate paths exist: ${candidates.join(", ")}`,
		);
	}
	return found;
}

const WORKER_URL = pathToFileURL(
	firstExisting([
		resolve(import.meta.dir, "worker.ts"),
		resolve(import.meta.dir, "worker.js"),
	]),
);
const BRIDGE_WORKER_URL = pathToFileURL(
	firstExisting([
		resolve(import.meta.dir, "test-helpers/bridge-test-worker.ts"),
		resolve(import.meta.dir, "test-helpers/bridge-test-worker.js"),
	]),
);

const tallyProgram = readFileSync(
	firstExisting([
		resolve(import.meta.dir, "../../wasm-integration-tests/test-vm.wasm"),
		resolve(
			import.meta.dir,
			"../../../../libs/wasm-integration-tests/test-vm.wasm",
		),
	]),
);

const PRICE_FEED_REVEALS =
	'[{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":200,"reveal":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,50,125]},{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":198,"reveal":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,52,53,125]},{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":201,"reveal":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,50,56,125]},{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":199,"reveal":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,55,125]},{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":202,"reveal":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,48,125]},{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":197,"reveal":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,52,49,125]},{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":200,"reveal":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,53,125]},{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":203,"reveal":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,57,125]},{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":196,"reveal":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,51,125]},{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":201,"reveal":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,54,125]}]';
const PRICE_FEED_CONSENSUS = "[0,0,0,0,0,0,0,0,0,0]";

function priceFeedCallData(
	binary: VmCallData["binary"] = tallyProgram,
): VmCallData {
	return {
		args: [
			Buffer.from("price_feed_tally").toString("hex"),
			PRICE_FEED_REVEALS,
			PRICE_FEED_CONSENSUS,
		],
		binary,
		envs: {
			CONSENSUS: "true",
			VM_MODE: "tally",
			DR_TALLY_GAS_LIMIT: "50000000000000",
		},
		vmMode: "tally",
		gasLimit: 50000000000000n,
	};
}

function stderrCallData(): VmCallData {
	return {
		args: [Buffer.from("call_result_write_0").toString("hex"), "[]", "[]"],
		binary: tallyProgram,
		envs: {
			CONSENSUS: "true",
			VM_MODE: "tally",
			DR_TALLY_GAS_LIMIT: "150000000000000",
		},
		vmMode: "tally",
	};
}

describe("callVm worker reuse", () => {
	it("reuses a persistent worker across sequential calls without listener growth or cross-talk", async () => {
		const worker = new Worker(WORKER_URL);

		try {
			for (let i = 0; i < 3; i++) {
				const priceResult = await callVm(
					priceFeedCallData(),
					worker,
					new TallyVmAdapter(),
				);
				expect(priceResult.stdout).toBe("1129935\n");
				expect(priceResult.exitCode).toBe(0);

				const errResult = await callVm(
					stderrCallData(),
					worker,
					new TallyVmAdapter(),
				);
				expect(errResult.stderr).toInclude(
					"call_result_write: result_data_ptr length does not match call_value length",
				);

				expect(worker.listenerCount("message")).toBe(0);
				expect(worker.listenerCount("error")).toBe(0);
				expect(worker.listenerCount("exit")).toBe(0);
			}
		} finally {
			await worker.terminate();
		}
	});

	it("produces results identical to sync (in-process) mode", async () => {
		const worker = new Worker(WORKER_URL);

		try {
			const workerResult = await callVm(
				priceFeedCallData(),
				worker,
				new TallyVmAdapter(),
			);
			const syncResult = await callVm(
				priceFeedCallData(),
				undefined,
				new TallyVmAdapter(),
				true,
			);

			expect(workerResult.exitCode).toBe(syncResult.exitCode);
			expect(workerResult.stdout).toBe(syncResult.stdout);
			expect(workerResult.stderr).toBe(syncResult.stderr);
			expect(workerResult.gasUsed).toBe(syncResult.gasUsed);
			expect(workerResult.resultAsString).toBe(syncResult.resultAsString);
		} finally {
			await worker.terminate();
		}
	});

	it("strips the host-side WasmModuleCache and runs through the worker-local cache", async () => {
		const worker = new Worker(WORKER_URL);
		const cacheDir = mkdtempSync(join(tmpdir(), "vm-cache-"));

		try {
			for (let i = 0; i < 2; i++) {
				const result = await callVm(
					{
						...priceFeedCallData(),
						cache: { dir: cacheDir, id: "price-feed-test" },
						wasmModuleCache: new WasmModuleCache(5),
					},
					worker,
					new TallyVmAdapter(),
				);

				expect(result.exitCode).toBe(0);
				expect(result.stdout).toBe("1129935\n");
			}
		} finally {
			await worker.terminate();
		}
	});

	it("accepts a precompiled WebAssembly.Module as binary", async () => {
		const moduleResult = await createWasmModule(tallyProgram, "tally");
		expect(moduleResult.isOk).toBe(true);
		if (moduleResult.isErr) return;

		const worker = new Worker(WORKER_URL);

		try {
			const result = await callVm(
				priceFeedCallData(moduleResult.value),
				worker,
				new TallyVmAdapter(),
			);

			expect(result.exitCode).toBe(0);
			expect(result.stdout).toBe("1129935\n");
		} finally {
			await worker.terminate();
		}
	});
});

class MockBridgeAdapter implements VmAdapter {
	modifyVmCallData(input: VmCallData): VmCallData {
		return input;
	}

	setProcessId(_processId: string) {}

	async httpFetch(
		action: HttpFetchAction,
	): Promise<PromiseStatus<HttpFetchResponse>> {
		const body = Array.from(new TextEncoder().encode("bridge-response"));

		return PromiseStatus.fulfilled(
			new HttpFetchResponse({
				bytes: body,
				content_length: body.length,
				headers: {},
				status: 200,
				url: action.url,
			}),
		);
	}

	async getProxyHttpFetchGasCost(
		_action: ProxyHttpFetchAction,
	): Promise<Result<bigint, Error>> {
		return Result.ok(0n);
	}

	async proxyHttpFetch(
		_action: ProxyHttpFetchAction,
	): Promise<PromiseStatus<HttpFetchResponse>> {
		return HttpFetchResponse.createRejectedPromise("not used");
	}

	getClockTime(_mode: "monotonic" | "realtime"): number {
		return 0;
	}
}

describe("WorkerToHost bridge", () => {
	it("round-trips a host action with the processId attached to every message", async () => {
		const processId = "bridge-test-1";
		const notifierBuffer = new SharedArrayBuffer(8);
		const hostToWorker = new HostToWorker(
			new MockBridgeAdapter(),
			processId,
			notifierBuffer,
		);

		const worker = new Worker(BRIDGE_WORKER_URL, {
			workerData: { notifierBuffer, processId, hostCallTimeoutMs: 5_000 },
		});

		const seenProcessIds: string[] = [];

		try {
			const reply = await new Promise<{ ok: boolean; resultUtf8?: string }>(
				(resolve, reject) => {
					worker.on("message", async (message) => {
						if (message.type === WorkerMessageType.VmActionExecute) {
							seenProcessIds.push(
								(message as VmActionExecuteMessage).processId,
							);
							await hostToWorker.executeAction(message.action);
						} else if (
							message.type === WorkerMessageType.VmActionResultBuffer
						) {
							seenProcessIds.push(message.processId);
							await hostToWorker.sendActionResultToWorker(message.buffer);
						} else {
							resolve(message);
						}
					});
					worker.on("error", reject);
				},
			);

			expect(reply.ok).toBe(true);
			expect(reply.resultUtf8).toInclude("Fulfilled");
			expect(seenProcessIds).toEqual([processId, processId]);
		} finally {
			await worker.terminate();
		}
	});

	it("times out instead of wedging the worker when the host never answers", async () => {
		const processId = "bridge-test-timeout";
		const notifierBuffer = new SharedArrayBuffer(8);

		const worker = new Worker(BRIDGE_WORKER_URL, {
			workerData: { notifierBuffer, processId, hostCallTimeoutMs: 200 },
		});

		try {
			const reply = await new Promise<{ ok: boolean; error?: string }>(
				(resolve, reject) => {
					worker.on("message", (message) => {
						// Ignore the action requests: this host deliberately never answers
						if (
							message.type !== WorkerMessageType.VmActionExecute &&
							message.type !== WorkerMessageType.VmActionResultBuffer
						) {
							resolve(message);
						}
					});
					worker.on("error", reject);
				},
			);

			expect(reply.ok).toBe(false);
			expect(reply.error).toInclude("did not answer the VM action");
		} finally {
			await worker.terminate();
		}
	});
});
