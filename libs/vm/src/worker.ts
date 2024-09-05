import { parentPort } from "node:worker_threads";
import {
	type VmResultWorkerMessage,
	type WorkerMessage,
	WorkerMessageType,
} from "./types/worker-messages.js";
import { executeVm } from "./vm.js";

parentPort?.on("message", async (event) => {
	try {
		const message: WorkerMessage = event;

		if (message.type === WorkerMessageType.VmCall) {
			const result = await executeVm(
				message.callData,
				message.notifierBuffer,
				message.processId,
			);
			const response: VmResultWorkerMessage = {
				result,
				type: WorkerMessageType.VmResult,
			};

			parentPort?.postMessage(response);
		}
	} catch (error) {
		console.error("@worker:message, error thrown: ", error);
	}
});
