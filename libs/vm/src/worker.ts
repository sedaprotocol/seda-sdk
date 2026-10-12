import { isMainThread, parentPort } from "node:worker_threads";
import { WasmModuleCache } from "./services/wasm-module-cache.js";
import type { VmCallData } from "./types/vm-call-data.js";
import {
	type VmResultWorkerMessage,
	type WorkerMessage,
	WorkerMessageType,
} from "./types/worker-messages.js";
import { executeVm } from "./vm.js";

const WASM_MODULE_CACHE_CAPACITY = 10;

// A WasmModuleCache instance does not survive structured clone, so the host
// strips it from the posted callData and the worker maintains its own.
const wasmModuleCache = new WasmModuleCache(WASM_MODULE_CACHE_CAPACITY);

let isStarted = false;

export function startWorker() {
	if (isStarted) return;
	isStarted = true;

	parentPort?.on("message", async (event) => {
		const message: WorkerMessage = event;

		if (message.type !== WorkerMessageType.VmCall) return;

		try {
			const callData: VmCallData = {
				...message.callData,
				wasmModuleCache: message.callData.cache?.id
					? wasmModuleCache
					: undefined,
			};

			const result = await executeVm(
				callData,
				message.processId,
				message.notifierBuffer,
			);
			const response: VmResultWorkerMessage = {
				result,
				processId: message.processId,
				type: WorkerMessageType.VmResult,
			};

			parentPort?.postMessage(response);
		} catch (error) {
			console.error("@worker:message, error thrown: ", error);

			// Always answer, otherwise a persistent host waits forever on this call
			const response: VmResultWorkerMessage = {
				result: {
					exitCode: 1,
					stderr: `[${message.processId}] - Worker failed to execute VM call: ${error}`,
					stdout: "",
					gasUsed: 0n,
				},
				processId: message.processId,
				type: WorkerMessageType.VmResult,
			};

			parentPort?.postMessage(response);
		}
	});
}

// This way we can re-export the worker without it throwing errors.
// Can be required for when compiling bundles.
if (!isMainThread) {
	startWorker();
}
