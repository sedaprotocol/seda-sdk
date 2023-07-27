import { Worker } from "node:worker_threads";
// import workerSrc from "inline-worker:./worker.ts";
import { VmCallData, VmResult } from "./vm";
import { VmCallWorkerMessage, WorkerMessage, WorkerMessageType } from "./types/worker-messages";

export function callVm(callData: VmCallData, workerUrl?: string): Promise<VmResult> {
  return new Promise(async (resolve, reject) => {
    // @ts-expect-error
    let workerSrc = await import("inline-worker:./worker.ts");
    let worker = new Worker(workerSrc.default, { eval: true });
    let workerMessage: VmCallWorkerMessage = {
      processId: Math.random().toString(),
      callData,
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

async function main() {
  const wasmResponse = await fetch("https://deno.land/x/wasm/tests/demo.wasm");
  const wasmData = await wasmResponse.arrayBuffer();

  const result = await callVm({
    args: [],
    envs: {},
    binary: Array.from(new Uint8Array(wasmData)),
  });

  console.log(result);
}

main();
