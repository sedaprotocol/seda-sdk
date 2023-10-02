import { parentPort } from 'node:worker_threads';
import { executeVm } from './vm.js';
import {
  VmResultWorkerMessage,
  WorkerMessage,
  WorkerMessageType,
} from './types/worker-messages.js';

parentPort?.on('message', async function (event) {
  try {
    const message: WorkerMessage = event;

    if (message.type === WorkerMessageType.VmCall) {
      const result = await executeVm(message.callData, message.notifierBuffer, message.processId);
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
