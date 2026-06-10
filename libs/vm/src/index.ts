import { randomBytes } from "node:crypto";
import { format, parse } from "node:path";
import { Worker } from "node:worker_threads";
import { tryAsync } from "@seda-protocol/utils";
import DataRequestVmAdapter from "./data-request-vm-adapter.js";
import { createProcessId } from "./services/create-process-id.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import type { VmCallData } from "./types/vm-call-data.js";
import {
	type VmCallWorkerMessage,
	type WorkerMessage,
	WorkerMessageType,
} from "./types/worker-messages.js";
import { type VmResult, executeVm } from "./vm.js";
import { HostToWorker } from "./worker-host-communication.js";

export * from "./types/vm-modes.js";
export * as metering from "./metering.js";
export { default as TallyVmAdapter } from "./tally-vm-adapter.js";
export { default as DataRequestVmAdapter } from "./data-request-vm-adapter.js";

export { PromiseStatus } from "./types/vm-promise.js";
export type { VmResult } from "./vm.js";
export type { VmCallData } from "./types/vm-call-data.js";
export { startWorker } from "./worker.js";
export {
	createWasmModule,
	type CacheOptions,
} from "./services/wasm-module.js";
export { executeVm } from "./vm.js";
export { WasmModuleCache } from "./services/wasm-module-cache.js";

export const version = "1.0";

export {
	type HttpFetchAction,
	HttpFetchMethod,
	type HttpFetchOptions,
	HttpFetchResponse,
	type ProxyHttpFetchAction,
	type ProxyHttpFetchGasCostAction,
	type HttpFetchResponseData,
} from "./types/vm-actions.js";

/**
 * Executes the given WASM binary as if it were an Oracle Program
 *
 * A persistent `Worker` may be passed in and reused across sequential calls:
 * all message traffic is scoped by a per-call process id and the listeners are
 * removed once the call settles. Only one call may be in flight per worker at
 * a time (the Atomics notifier buffer is per-call state); callers reusing a
 * worker must queue calls themselves.
 *
 * @param callData The call data passed to the VM
 * @param worker URL of the compiled worker.js, or a (reusable) Worker instance
 * @param vmAdapter Option to insert a custom VM adapter, can be used to mock
 * @returns
 */
export function callVm(
	callData: VmCallData,
	worker?: string | Worker,
	vmAdapter: VmAdapter = new DataRequestVmAdapter(),
	sync = false,
): Promise<VmResult> {
	// biome-ignore lint/suspicious/noAsyncPromiseExecutor: We do need it for the sync flow
	return new Promise(async (resolve) => {
		const finalCallData: VmCallData = vmAdapter.modifyVmCallData(callData);

		// The nonce makes the id unique per call so a reused worker's stale
		// messages (same binary and args) can never be attributed to this call.
		const processId = sync
			? createProcessId(finalCallData)
			: `${createProcessId(finalCallData)}-${randomBytes(8).toString("hex")}`;
		vmAdapter.setProcessId(processId);

		// We run in a synchronous environment, no workers are used.
		if (sync) {
			const syncresult = await tryAsync(
				executeVm(finalCallData, processId, vmAdapter),
			);
			if (syncresult.isErr) throw syncresult.error;
			return resolve(syncresult.value);
		}

		let vmWorker: Worker;
		let ownsWorker = false;

		if (worker === undefined) {
			const CURRENT_FILE_PATH = parse(import.meta.url);
			CURRENT_FILE_PATH.base = "worker.js";
			const DEFAULT_WORKER_PATH = format(CURRENT_FILE_PATH);
			vmWorker = new Worker(DEFAULT_WORKER_PATH);
			ownsWorker = true;
		} else if (typeof worker === "string") {
			vmWorker = new Worker(new URL(worker));
			ownsWorker = true;
		} else {
			vmWorker = worker;
		}

		const notifierBuffer = new SharedArrayBuffer(8); // 4 bytes for notifying, 4 bytes for storing i32 numbers

		const hostToWorker = new HostToWorker(vmAdapter, processId, notifierBuffer);

		// WasmModuleCache does not survive structured clone (it would arrive as
		// a broken plain object); the worker keeps its own module cache.
		const { wasmModuleCache: _hostCache, ...transferableCallData } =
			finalCallData;
		const workerMessage: VmCallWorkerMessage = {
			processId,
			callData: transferableCallData,
			notifierBuffer,
			type: WorkerMessageType.VmCall,
		};

		let settled = false;
		const settle = (result: VmResult) => {
			if (settled) return;
			settled = true;

			vmWorker.off("message", onMessage);
			vmWorker.off("error", onError);
			vmWorker.off("exit", onExit);

			if (ownsWorker) {
				void vmWorker.terminate();
			}

			resolve(result);
		};

		const onMessage = async (message: WorkerMessage) => {
			try {
				if (message.type === WorkerMessageType.VmResult) {
					if (message.processId !== processId) return;
					settle(message.result);
				} else if (message.type === WorkerMessageType.VmActionExecute) {
					if (message.processId !== processId) return;
					await hostToWorker.executeAction(message.action);
				} else if (message.type === WorkerMessageType.VmActionResultBuffer) {
					if (message.processId !== processId) return;
					await hostToWorker.sendActionResultToWorker(message.buffer);
				} else {
					console.warn(`[${processId}] - Unknown message: ${message}`);
				}
			} catch (error) {
				console.error(`[${processId}] - @callVm-onMessage: `, error);
			}
		};

		const onError = (error: Error) => {
			settle({
				exitCode: 1,
				stderr: `[${processId}] - Worker threw an uncaught error: ${error}`,
				stdout: "",
				gasUsed: 0n,
				crashed: true,
			});
		};

		const onExit = (exitCode: number) => {
			settle({
				exitCode,
				stderr: `[${processId}] - The worker has been terminated`,
				stdout: "",
				gasUsed: 0n,
				crashed: true,
			});
		};

		vmWorker.on("message", onMessage);
		vmWorker.on("error", onError);
		vmWorker.on("exit", onExit);

		vmWorker.postMessage(workerMessage);
	});
}
