import { parentPort } from "worker_threads";
import type { VmAdapter } from "./types/vm-adapter";
import type { VmAction } from "./types/vm-actions";
import type { VmActionExecuteMessage, VmActionResultBufferMessage } from "./types/worker-messages";
import { WorkerMessageType } from "./types/worker-messages.js";
import { PromiseStatus, ToBuffer } from "./types/vm-promise.js";

const MAX_I32_VALUE = 2_147_483_647;

/** Location where the worker thread should listen for changes */
const NOTIFIER_INDEX = 0;

enum AtomicState {
  RequestResultLength = 0,
  ResponseResultLength = 1,
  RequestResult = 2,
  ResponseResult = 3,
}

class EmptyBuffer implements ToBuffer {
  toBuffer(): Uint8Array {
    return new Uint8Array();
  }
}

function updateNotifierState(buffer: Int32Array, state: AtomicState) {
  Atomics.store(buffer, NOTIFIER_INDEX, state);
  Atomics.notify(buffer, NOTIFIER_INDEX);
}

function waitForNotifierStateChange(buffer: Int32Array, initialState: AtomicState) {
  Atomics.store(buffer, NOTIFIER_INDEX, initialState);
  Atomics.wait(buffer, NOTIFIER_INDEX, initialState);
}

/**
 * HostToWorker is a 2 step process
 *
 * First a request comes in from the worker, where the host executes the request and return the length of bytes while storing the value temp
 * Then the worker creates a shared array buffer which has that exact length and asks the host to write the value to that buffer
 * The host then writes the full value onto that buffer and unfreezes the worker thread
 */
export class HostToWorker {
  private actionResult: PromiseStatus<unknown> = PromiseStatus.rejected(new EmptyBuffer);

  constructor(
    private adapter: VmAdapter,
    private notifierBuffer: SharedArrayBuffer
  ) {}

  async executeAction(action: VmAction) {
    try {
      const actionResult = await this.adapter.httpFetch(action);
      this.actionResult = actionResult;
    } catch (error) {
      console.error('Error @executeAction: ', error);
      this.actionResult = PromiseStatus.rejected(new EmptyBuffer);
    }

    if (this.actionResult.length > MAX_I32_VALUE) {
      throw Error(`Value ${this.actionResult.length} exceeds max i32 (${MAX_I32_VALUE})`);
    }

    const notifierBufferi32 = new Int32Array(this.notifierBuffer);
    notifierBufferi32.set([this.actionResult.length], 1);

    updateNotifierState(notifierBufferi32, AtomicState.ResponseResultLength);
  }

  async sendActionResultToWorker(target: SharedArrayBuffer) {
    if (target.byteLength !== this.actionResult.length) {
      throw new Error(
        `target buffer does not have a length of ${this.actionResult.length}, received: ${target.byteLength}`
      );
    }

    const targetu8 = new Uint8Array(target);
    targetu8.set(this.actionResult.toBuffer());

    const notifierBufferi32 = new Int32Array(this.notifierBuffer);
    updateNotifierState(notifierBufferi32, AtomicState.ResponseResult);
  }
}

export class WorkerToHost {
  constructor(private notifierBuffer: SharedArrayBuffer) {}

  /**
   * Calls the given action on the host machine and sleeps the thread until an answer has been received
   * Communication goes back and forth 2 times in order to set up the correct length of the shared buffer and write the results
   * @param action
   * @returns
   */
  callActionOnHost(action: VmAction): Uint8Array {
    const actionMessage: VmActionExecuteMessage = {
      type: WorkerMessageType.VmActionExecute,
      action,
    };

    parentPort?.postMessage(actionMessage);
    const notifierBufferi32 = new Int32Array(this.notifierBuffer);

    waitForNotifierStateChange(
      notifierBufferi32,
      AtomicState.RequestResultLength
    );

    const length = notifierBufferi32[1];

    // No need to do a full roundtrip if there are no bytes
    if (length === 0) {
      return Buffer.from([]);
    }

    const valueBuffer = new SharedArrayBuffer(length);
    const message: VmActionResultBufferMessage = {
      buffer: valueBuffer,
      type: WorkerMessageType.VmActionResultBuffer,
    };

    parentPort?.postMessage(message);

    waitForNotifierStateChange(notifierBufferi32, AtomicState.RequestResult);

    return new Uint8Array(valueBuffer);
  }
}
