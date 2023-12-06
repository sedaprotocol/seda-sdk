import type { HttpFetchAction } from './types/vm-actions';
import { WorkerToHost } from './worker-host-communication.js';

export default class VmImports {
  memory?: WebAssembly.Memory;
  workerToHost: WorkerToHost;
  callResult: Uint8Array = new Uint8Array();
  result: Uint8Array = new Uint8Array();
  processId: string;

  constructor(notifierBuffer: SharedArrayBuffer, processId: string) {
    this.workerToHost = new WorkerToHost(notifierBuffer, processId);
    this.processId = processId;
  }

  setMemory(memory: WebAssembly.Memory) {
    this.memory = memory;
  }

  httpFetch(action: number, actionLength: number) {
    const rawAction = new Uint8Array(
      this.memory?.buffer.slice(action, action + actionLength) ?? []
    );
    const messageRaw = Buffer.from(rawAction).toString('utf-8');

    try {
      const message: HttpFetchAction = JSON.parse(messageRaw);
      this.callResult = this.workerToHost.callActionOnHost(message);
      return this.callResult.length;
    } catch (error) {
      console.error(`[${this.processId}] - @httpFetch: ${messageRaw}`, error);
      this.callResult = new Uint8Array();

      return 0;
    }
  }

  callResultWrite(ptr: number, length: number) {
    try {
      const memory = new Uint8Array(this.memory?.buffer ?? []);
      memory.set(this.callResult.slice(0, length), ptr);
    } catch (err) {
      console.error(`[${this.processId}] - @callResultWrite: `, err);
    }
  }

  executionResult(ptr: number, length: number) {
    this.result = new Uint8Array(
      this.memory?.buffer.slice(ptr, ptr + length) ?? []
    );
  }

  getImports(wasiImports: object): WebAssembly.Imports {
    return {
      // TODO: Data requests should not have this many imports
      // we should restrict it to only a few
      ...wasiImports,
      seda_v1: {
        http_fetch: this.httpFetch.bind(this),
        call_result_write: this.callResultWrite.bind(this),
        execution_result: this.executionResult.bind(this),
      },
    };
  }
}
