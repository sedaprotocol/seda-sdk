import { parentPort } from "node:worker_threads";
import { tryAsync } from "@seda-protocol/utils";
import { Result, ResultNS } from "true-myth";
import { ResultJSON } from "true-myth/result";
import { JSONStringify } from "./services/json.js";
import {
	HttpFetchResponse,
	type VmAction,
	isHttpFetchAction,
	isProxyHttpFetchAction,
	isProxyHttpFetchGasCostAction,
} from "./types/vm-actions.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import { PromiseStatus, type ToBuffer } from "./types/vm-promise.js";
import type {
	VmActionExecuteMessage,
	VmActionResultBufferMessage,
} from "./types/worker-messages.js";
import { WorkerMessageType } from "./types/worker-messages.js";

const MAX_I32_VALUE = 2_147_483_647;

/** Location where the worker thread should listen for changes */
const NOTIFIER_INDEX = 0;

enum AtomicState {
	Initial = 0,
	RequestResultLength = 1,
	ResponseResultLength = 2,
	RequestResult = 3,
	ResponseResult = 4,
}

function updateNotifierState(buffer: Int32Array, state: AtomicState) {
	Atomics.store(buffer, NOTIFIER_INDEX, state);
	Atomics.notify(buffer, NOTIFIER_INDEX);
}

function resetNotifierState(buffer: Int32Array) {
	Atomics.store(buffer, NOTIFIER_INDEX, AtomicState.Initial);
}

function waitForNotifierStateChange(
	buffer: Int32Array,
	initialState: AtomicState,
) {
	const currentState = Atomics.load(buffer, NOTIFIER_INDEX);

	// If work has already been executed don't freeze the thread and wait
	// There is a case where the PostMessage fires and completes before a wait could be called causing a deadlock
	if (currentState > initialState) {
		return;
	}

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
	private actionResult: Buffer = Buffer.alloc(0);

	constructor(
		private adapter: VmAdapter,
		private notifierBuffer: SharedArrayBuffer,
		private processId: string,
	) {}

	async executeAction(action: VmAction) {
		if (isHttpFetchAction(action)) {
			const actionResult = await tryAsync(this.adapter.httpFetch(action));

			this.actionResult = actionResult.match({
				Ok: (value) => value.toBuffer(),
				Err: (error) =>
					HttpFetchResponse.createRejectedPromise(error.message).toBuffer(),
			});
		} else if (isProxyHttpFetchGasCostAction(action)) {
			const actionResult = (
				await this.adapter.getProxyHttpFetchGasCost(action.fetchAction)
			).mapErr((error) => error.message);

			this.actionResult = Buffer.from(JSONStringify(actionResult.toJSON()));
		} else if (isProxyHttpFetchAction(action)) {
			const actionResult = await tryAsync(this.adapter.proxyHttpFetch(action));

			this.actionResult = actionResult.match({
				Ok: (value) => value.toBuffer(),
				Err: (error) =>
					HttpFetchResponse.createRejectedPromise(error.message).toBuffer(),
			});
		}

		if (typeof this.actionResult === "undefined") {
			console.error(`[${this.processId}] - Objects that failed: ${action}`);
			throw Error(
				`[${this.processId}] - Result was undefined while reading. Action was: ${action}`,
			);
		}

		if (this.actionResult.length > MAX_I32_VALUE) {
			throw Error(
				`[${this.processId}] - Value ${this.actionResult.length} exceeds max i32 (${MAX_I32_VALUE})`,
			);
		}

		const notifierBufferi32 = new Int32Array(this.notifierBuffer);
		notifierBufferi32.set([this.actionResult.length], 1);

		updateNotifierState(notifierBufferi32, AtomicState.ResponseResultLength);
	}

	async sendActionResultToWorker(target: SharedArrayBuffer) {
		if (target.byteLength !== this.actionResult.length) {
			throw new Error(
				`[${this.processId}] - target buffer does not have a length of ${this.actionResult.length}, received: ${target.byteLength}`,
			);
		}

		const targetu8 = new Uint8Array(target);
		targetu8.set(this.actionResult);

		const notifierBufferi32 = new Int32Array(this.notifierBuffer);
		updateNotifierState(notifierBufferi32, AtomicState.ResponseResult);
	}
}

export class WorkerToHost {
	constructor(
		private notifierBuffer: SharedArrayBuffer,
		private processId: string,
	) {}

	/**
	 * Calls the given action on the host machine and sleeps the thread until an answer has been received
	 * Communication goes back and forth 2 times in order to set up the correct length of the shared buffer and write the results
	 * @param action
	 * @returns
	 */
	callActionOnHost(action: VmAction): Buffer {
		const notifierBufferi32 = new Int32Array(this.notifierBuffer);
		resetNotifierState(notifierBufferi32);

		const actionMessage: VmActionExecuteMessage = {
			type: WorkerMessageType.VmActionExecute,
			action,
		};

		parentPort?.postMessage(actionMessage);

		waitForNotifierStateChange(
			notifierBufferi32,
			AtomicState.RequestResultLength,
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

		return Buffer.from(new Uint8Array(valueBuffer));
	}
}
