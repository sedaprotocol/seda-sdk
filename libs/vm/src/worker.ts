import { parentPort, workerData } from "node:worker_threads";
import { executeVm } from "./vm";
import { VmResultWorkerMessage, WorkerMessage, WorkerMessageType } from "./types/worker-messages";

parentPort?.on("message", async (event) => {
  let message: WorkerMessage = JSON.parse(event);

  if (message.type === WorkerMessageType.VmCall) {
    let result = await executeVm(message.callData);
    let response: VmResultWorkerMessage = {
      processId: message.processId,
      result,
      type: WorkerMessageType.VmResult,
    };

    parentPort?.postMessage(JSON.stringify(response));
  }
});
