import { format, parse } from "node:path";
import { Worker } from "node:worker_threads";
import { tryAsync } from "@seda-protocol/utils";
import DataRequestVmAdapter from "./data-request-vm-adapter.js";
import { createProcessId } from "./services/create-process-id.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import {
	type VmCallWorkerMessage,
	type WorkerMessage,
	WorkerMessageType,
} from "./types/worker-messages.js";
import { type VmCallData, type VmResult, executeVm } from "./vm.js";
import { HostToWorker } from "./worker-host-communication.js";

export * from "./types/vm-modes.js";
export { default as TallyVmAdapter } from "./tally-vm-adapter.js";
export { default as DataRequestVmAdapter } from "./data-request-vm-adapter.js";

export { PromiseStatus } from "./types/vm-promise.js";
export type { VmCallData, VmResult } from "./vm.js";
export { startWorker } from "./worker.js";
export {
	createWasmModule,
	type CacheOptions,
} from "./services/compile-wasm-moudle.js";
export { executeVm } from "./vm.js";

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

const CURRENT_FILE_PATH = parse(import.meta.url);
CURRENT_FILE_PATH.base = "worker.js";
const DEFAULT_WORKER_PATH = format(CURRENT_FILE_PATH);

/**
 * Executes the given WASM binary as if it were an Oracle Program
 *
 * @param callData The call data passed to the VM
 * @param worker URL of the compiled worker.js
 * @param vmAdapter Option to insert a custom VM adapter, can be used to mock
 * @returns
 */
export function callVm(
	callData: VmCallData,
	worker: string | Worker = DEFAULT_WORKER_PATH,
	vmAdapter: VmAdapter = new DataRequestVmAdapter(),
	sync = false,
): Promise<VmResult> {
	// biome-ignore lint/suspicious/noAsyncPromiseExecutor: We do need it for the sync flow
	return new Promise(async (resolve) => {
		const finalCallData: VmCallData = vmAdapter.modifyVmCallData(callData);

		const processId = createProcessId(finalCallData);
		vmAdapter.setProcessId(processId);

		// We run in a synchronous environment, no workers are used.
		if (sync) {
			const syncresult = await tryAsync(
				executeVm(finalCallData, processId, vmAdapter),
			);
			if (syncresult.isErr) throw syncresult.error;
			return resolve(syncresult.value);
		}

		const vmWorker =
			typeof worker === "string" ? new Worker(new URL(worker)) : worker;
		const notifierBuffer = new SharedArrayBuffer(8); // 4 bytes for notifying, 4 bytes for storing i32 numbers

		const hostToWorker = new HostToWorker(vmAdapter, processId, notifierBuffer);
		const workerMessage: VmCallWorkerMessage = {
			processId,
			callData: {
				...finalCallData,
				binary: finalCallData.binary,
				// binary: Array.from(finalCallData.binary),
			},
			notifierBuffer,
			type: WorkerMessageType.VmCall,
		};

		vmWorker.on("message", async (message: WorkerMessage) => {
			try {
				if (message.type === WorkerMessageType.VmResult) {
					resolve(message.result);
				} else if (message.type === WorkerMessageType.VmActionExecute) {
					await hostToWorker.executeAction(message.action);
				} else if (message.type === WorkerMessageType.VmActionResultBuffer) {
					await hostToWorker.sendActionResultToWorker(message.buffer);
				} else {
					console.warn(`[${processId}] - Unknown message: ${message}`);
				}
			} catch (error) {
				console.error(`[${processId}] - @callVm-onMessage: `, error);
			}
		});

		vmWorker.on("error", (error) => {
			resolve({
				exitCode: 1,
				stderr: `[${processId}] - Worker threw an uncaught error: ${error}`,
				stdout: "",
				gasUsed: 0n,
			});
		});

		vmWorker.on("exit", (exitCode) => {
			resolve({
				exitCode,
				stderr: `[${processId}] - The worker has been terminated`,
				stdout: "",
				gasUsed: 0n,
			});
		});

		vmWorker.postMessage(workerMessage);
	});
}
