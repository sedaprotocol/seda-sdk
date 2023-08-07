import { Worker } from "node:worker_threads";
import type { VmCallData, VmResult } from "./vm";
import { VmCallWorkerMessage, WorkerMessage, WorkerMessageType } from "./types/worker-messages.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import DefaultVmAdapter from "./default-vm-adapter.js";
import { parse, format } from "node:path";
import { HostToWorker } from "./worker-host-communication.js";

const CURRENT_FILE_PATH = parse(import.meta.url);
CURRENT_FILE_PATH.base = 'worker.js';
const DEFAULT_WORKER_PATH = format(CURRENT_FILE_PATH);

export function callVm(callData: VmCallData, workerUrl = DEFAULT_WORKER_PATH, vmAdapter: VmAdapter = new DefaultVmAdapter()): Promise<VmResult> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL(workerUrl));
    const notifierBuffer = new SharedArrayBuffer(8); // 4 bytes for notifying, 4 bytes for storing i32 numbers

    const hostToWorker = new HostToWorker(vmAdapter, notifierBuffer);
    const workerMessage: VmCallWorkerMessage = {
      callData: {
        ...callData,
        binary: Array.from(callData.binary),
      },
      notifierBuffer,
      type: WorkerMessageType.VmCall,
    };

    worker.on('message', (message: WorkerMessage) => {
      if (message.type === WorkerMessageType.VmResult) {
        resolve(message.result);
      } else if (message.type === WorkerMessageType.VmActionExecute) {
        hostToWorker.executeAction(message.action);
      } else if (message.type === WorkerMessageType.VmActionResultBuffer) {
        hostToWorker.sendActionResultToWorker(message.buffer);
      } else {
        console.warn('Unknown message', message);
      }
    });

    worker.postMessage(workerMessage);
  });
}
