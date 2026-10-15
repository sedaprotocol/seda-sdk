import { describe, expect, it } from "bun:test";
import { Worker } from "node:worker_threads";
import { setTimeout as sleep } from "node:timers/promises";
import { AtomicState } from "./worker-host-communication.js";

const NOTIFIER_INDEX = 0;
const READY_INDEX = 1;

const MODULE_URL = new URL("./worker-host-communication.ts", import.meta.url)
	.href;

const makeNotifierBuffer = (initial: AtomicState) => {
	const sab = new SharedArrayBuffer(8);
	const buffer = new Int32Array(sab);
	Atomics.store(buffer, NOTIFIER_INDEX, initial);
	return { sab, buffer };
};

/**
 * Runs waitForNotifierStateChange on a separate thread (the worker role in
 * production) so the test thread can play the host: observe the notifier
 * slot while the waiter blocks, then advance the state to release it.
 * Resolves with the final state the waiter observed after waking.
 */
const spawnWaiter = (sab: SharedArrayBuffer, initialState: AtomicState) => {
	const worker = new Worker(
		`
		const { workerData, parentPort } = require("node:worker_threads");
		const buffer = new Int32Array(workerData.sab);
		(async () => {
			const mod = await import(workerData.moduleUrl);
			Atomics.store(buffer, ${READY_INDEX}, 1);
			Atomics.notify(buffer, ${READY_INDEX});
			mod.waitForNotifierStateChange(buffer, workerData.initialState);
			parentPort.postMessage(Atomics.load(buffer, ${NOTIFIER_INDEX}));
		})();
		`,
		{ eval: true, workerData: { sab, initialState, moduleUrl: MODULE_URL } },
	);

	const finalState = new Promise<number>((resolve, reject) => {
		worker.once("message", resolve);
		worker.once("error", reject);
	});

	return { worker, finalState };
};

const waitForReady = (buffer: Int32Array) => {
	while (Atomics.load(buffer, READY_INDEX) !== 1) {
		Atomics.wait(buffer, READY_INDEX, 0, 50);
	}
};

describe("waitForNotifierStateChange", () => {
	it("returns immediately when the host already advanced past the awaited state", async () => {
		const { buffer } = makeNotifierBuffer(AtomicState.ResponseResultLength);
		const { waitForNotifierStateChange } = await import(MODULE_URL);

		waitForNotifierStateChange(buffer, AtomicState.RequestResultLength);

		expect(Atomics.load(buffer, NOTIFIER_INDEX)).toBe(
			AtomicState.ResponseResultLength,
		);
	});

	it("never writes to the notifier slot while waiting, so a concurrent host store cannot be lost", async () => {
		const { sab, buffer } = makeNotifierBuffer(AtomicState.Initial);
		const { worker, finalState } = spawnWaiter(
			sab,
			AtomicState.RequestResultLength,
		);

		try {
			waitForReady(buffer);

			// The lost-wakeup bug: the previous implementation stored the awaited
			// state into the slot before waiting. A host store landing between
			// the waiter's read and that write got overwritten, and the waiter
			// slept forever on a notify that had already fired. The wait must
			// observe, never write: the slot stays exactly as the host left it.
			for (let i = 0; i < 20; i++) {
				expect(Atomics.load(buffer, NOTIFIER_INDEX)).toBe(AtomicState.Initial);
				await sleep(2);
			}

			Atomics.store(buffer, NOTIFIER_INDEX, AtomicState.ResponseResultLength);
			Atomics.notify(buffer, NOTIFIER_INDEX);

			expect(await finalState).toBe(AtomicState.ResponseResultLength);
		} finally {
			await worker.terminate();
		}
	});

	it("wakes when the host advances the state mid-wait", async () => {
		const { sab, buffer } = makeNotifierBuffer(AtomicState.Initial);
		const { worker, finalState } = spawnWaiter(
			sab,
			AtomicState.RequestResultLength,
		);

		try {
			waitForReady(buffer);
			await sleep(20);

			Atomics.store(buffer, NOTIFIER_INDEX, AtomicState.ResponseResultLength);
			Atomics.notify(buffer, NOTIFIER_INDEX);

			expect(await finalState).toBe(AtomicState.ResponseResultLength);
		} finally {
			await worker.terminate();
		}
	});

	it("keeps waiting through the phase-1 state without corrupting it", async () => {
		// Phase 2 of the host-call protocol waits past RequestResult (3) while
		// the slot still holds ResponseResultLength (2) from phase 1. The waiter
		// must neither return early nor overwrite the slot; only the host's
		// ResponseResult (4) may release it.
		const { sab, buffer } = makeNotifierBuffer(
			AtomicState.ResponseResultLength,
		);
		const { worker, finalState } = spawnWaiter(sab, AtomicState.RequestResult);

		try {
			waitForReady(buffer);

			for (let i = 0; i < 20; i++) {
				expect(Atomics.load(buffer, NOTIFIER_INDEX)).toBe(
					AtomicState.ResponseResultLength,
				);
				await sleep(2);
			}

			Atomics.store(buffer, NOTIFIER_INDEX, AtomicState.ResponseResult);
			Atomics.notify(buffer, NOTIFIER_INDEX);

			expect(await finalState).toBe(AtomicState.ResponseResult);
		} finally {
			await worker.terminate();
		}
	});
});
