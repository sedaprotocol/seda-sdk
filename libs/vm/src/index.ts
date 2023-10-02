import { Worker } from "node:worker_threads";
import type { VmCallData, VmResult } from "./vm";
import { VmCallWorkerMessage, WorkerMessage, WorkerMessageType } from "./types/worker-messages.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import DefaultVmAdapter from "./default-vm-adapter.js";
import { parse, format } from "node:path";
import { HostToWorker } from "./worker-host-communication.js";
import { createProcessId } from "./services/create-process-id.js";

const CURRENT_FILE_PATH = parse(import.meta.url);
CURRENT_FILE_PATH.base = 'worker.js';
const DEFAULT_WORKER_PATH = format(CURRENT_FILE_PATH);

export function callVm(callData: VmCallData, workerUrl = DEFAULT_WORKER_PATH, vmAdapter: VmAdapter = new DefaultVmAdapter()): Promise<VmResult> {
  return new Promise((resolve) => {
    const processId = createProcessId(callData);
    vmAdapter.setProcessId(processId);

    const worker = new Worker(new URL(workerUrl));
    const notifierBuffer = new SharedArrayBuffer(8); // 4 bytes for notifying, 4 bytes for storing i32 numbers

    const hostToWorker = new HostToWorker(vmAdapter, notifierBuffer, processId);
    const workerMessage: VmCallWorkerMessage = {
      processId,
      callData: {
        ...callData,
        binary: Array.from(callData.binary),
      },
      notifierBuffer,
      type: WorkerMessageType.VmCall,
    };

    worker.on('message', async (message: WorkerMessage) => {
      try {
        if (message.type === WorkerMessageType.VmResult) {
          worker.terminate();
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

    worker.on('error', (error) => {
      resolve({
        exitCode: 1,
        stderr: `[${processId}] - Worker threw an uncaught error: ${error}`,
        stdout: '',
      });
    });

    worker.on('exit', (exitCode) => {
      resolve({
        exitCode,
        stderr: `[${processId}] - The worker has been terminated`,
        stdout: '',
      })
    });

    worker.postMessage(workerMessage);
  });
}
