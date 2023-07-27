import { parentPort } from "node:worker_threads";

parentPort?.on("message", (event) => {
  console.log('Message from host:', event);
});
