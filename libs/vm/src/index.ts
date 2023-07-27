import { Worker } from "node:worker_threads";
// @ts-expect-error
import workerSrc from "inline-worker:./worker.ts";

let worker = new Worker(workerSrc, { eval: true });
worker.postMessage("hello, world!");
