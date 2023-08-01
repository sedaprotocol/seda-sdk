import { Worker } from "node:worker_threads";
// @ts-expect-error
import workerSrc from "inline-worker:./worker.ts";
import { VmCallData, VmResult } from "./vm";
import { VmCallWorkerMessage, WorkerMessage, WorkerMessageType } from "./types/worker-messages";

export function callVm(callData: VmCallData): Promise<VmResult> {
  return new Promise(async (resolve, reject) => {

    let worker = new Worker(workerSrc, { eval: true });
    let workerMessage: VmCallWorkerMessage = {
      processId: Math.random().toString(),
      callData: {
        ...callData,
        binary: Array.from(callData.binary),
      },
      type: WorkerMessageType.VmCall,
    };

    worker.on("message", (event) => {
      let message: WorkerMessage = JSON.parse(event);

      if (message.type === WorkerMessageType.VmResult && message.processId === workerMessage.processId) {
        resolve(message.result);
      }
    });

    worker.postMessage(JSON.stringify(workerMessage));
  });
}
