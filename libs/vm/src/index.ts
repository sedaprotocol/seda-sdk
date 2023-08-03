import { Worker } from "node:worker_threads";
import type { VmCallData, VmResult } from "./vm";
import { VmCallWorkerMessage, WorkerMessage, WorkerMessageType } from "./types/worker-messages.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import DefaultVmAdapter from "./default-vm-adapter.js";
import { parse, format } from "node:path";

const CURRENT_FILE_PATH = parse(import.meta.url);
CURRENT_FILE_PATH.base = 'worker.js';
const DEFAULT_WORKER_PATH = format(CURRENT_FILE_PATH);

export function callVm(callData: VmCallData, workerUrl = DEFAULT_WORKER_PATH, vmAdapter: VmAdapter = new DefaultVmAdapter()): Promise<VmResult> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL(workerUrl));
    const workerMessage: VmCallWorkerMessage = {
      processId: Math.random().toString(),
      callData: {
        ...callData,
        binary: Array.from(callData.binary),
      },
      type: WorkerMessageType.VmCall,
    };

    worker.on("message", (event) => {
      const message: WorkerMessage = JSON.parse(event);

      if (message.type === WorkerMessageType.VmResult && message.processId === workerMessage.processId) {
        resolve(message.result);
      }
    });

    worker.postMessage(JSON.stringify(workerMessage));
  });
}

async function main() {
  const result = await callVm({
    args: [],
    binary: new Uint8Array(),
    envs: {},
  });

  console.log(result);
}

main();
