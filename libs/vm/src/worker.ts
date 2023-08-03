import { parentPort, isMainThread } from 'node:worker_threads';
import { executeVm } from './vm.js';
import {
  VmResultWorkerMessage,
  WorkerMessage,
  WorkerMessageType,
} from './types/worker-messages.js';

parentPort?.on('message', async function (event) {
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
