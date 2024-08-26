import { HttpFetchResponse, type HttpFetchAction } from './types/vm-actions';
import { PromiseStatus } from './types/vm-promise';
import { WorkerToHost } from './worker-host-communication.js';
import { Maybe } from "true-myth";
import * as Secp256k1 from "@noble/secp256k1";
import { keccak256 } from './services/keccak256';

export default class VmImports {
  memory?: WebAssembly.Memory;
  workerToHost: WorkerToHost;
  callResult: Uint8Array = new Uint8Array();
  result: Uint8Array = new Uint8Array();
  usedPublicKeys: string[] = [];
  processId: string;

  constructor(notifierBuffer: SharedArrayBuffer, processId: string) {
    this.workerToHost = new WorkerToHost(notifierBuffer, processId);
    this.processId = processId;
  }

  setMemory(memory: WebAssembly.Memory) {
    this.memory = memory;
  }

  /**
   * TODO: This function also must create the x-seda-proof the same way the overlay node does it
   * TODO: This function must be modified to make the verification the same as the data proxy side
   * @param action 
   * @param actionLength 
   * @returns 
   */
  proxyHttpFetch(action: number, actionLength: number) {
    const rawAction = new Uint8Array(
      this.memory?.buffer.slice(action, action + actionLength) ?? []
    );
    const messageRaw = Buffer.from(rawAction).toString('utf-8');

    try {
      const message: HttpFetchAction = JSON.parse(messageRaw);
      const rawResponse = Buffer.from(this.workerToHost.callActionOnHost(message));
      const httpResponse = HttpFetchResponse.fromPromise(PromiseStatus.fromBuffer(rawResponse));

      const signatureRaw = Maybe.of(httpResponse.data.headers['x-seda-signature']);
      const publicKeyRaw = Maybe.of(httpResponse.data.headers['x-seda-publickey']);

      if (!signatureRaw.isJust) {
        this.callResult = HttpFetchResponse.createRejectedPromise("Header x-seda-signature was not available").toBuffer();
        return this.callResult.length;
      }

      if (!publicKeyRaw.isJust) {
        this.callResult = HttpFetchResponse.createRejectedPromise("Header x-seda-publickey was not available").toBuffer();
        return this.callResult.length;
      }

      // Verify the signature:
      const signature = Buffer.from(signatureRaw.value, 'hex');
      const publicKey = Buffer.from(publicKeyRaw.value, 'hex');
      const signedMessage = keccak256(Buffer.from(httpResponse.data.bytes));
      const isValidSignature = Secp256k1.verify(signature, signedMessage, publicKey);

      if (!isValidSignature) {
        this.callResult = HttpFetchResponse.createRejectedPromise("Invalid signature").toBuffer();
        return this.callResult.length;
      }

      this.usedPublicKeys.push(publicKeyRaw.value);

      this.callResult = rawResponse;
      return this.callResult.length;
    } catch (error) {
      console.error(`[${this.processId}] - @httpFetch: ${messageRaw}`, error);
      this.callResult = new Uint8Array();

      return 0;
    }
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
        // TODO: Should be this.proxyHttpFetch but since thats broken for now we will use httpFetch
        proxy_http_fetch: this.httpFetch.bind(this),
        http_fetch: this.httpFetch.bind(this),
        call_result_write: this.callResultWrite.bind(this),
        execution_result: this.executionResult.bind(this),
      },
    };
  }
}
