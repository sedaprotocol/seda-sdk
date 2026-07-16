import { parentPort, workerData } from "node:worker_threads";
import { HttpFetchMethod } from "../types/vm-actions.js";
import { WorkerToHost } from "../worker-host-communication.js";

const { notifierBuffer, processId, hostCallTimeoutMs } = workerData as {
	notifierBuffer: SharedArrayBuffer;
	processId: string;
	hostCallTimeoutMs: number;
};

const workerToHost = new WorkerToHost(
	notifierBuffer,
	[],
	processId,
	hostCallTimeoutMs,
);

try {
	const result = workerToHost.callActionOnHost({
		type: "http-fetch-action",
		url: "https://bridge.test/value",
		options: {
			method: HttpFetchMethod.Get,
			headers: {},
		},
	});

	parentPort?.postMessage({ ok: true, resultUtf8: result.toString("utf-8") });
} catch (error) {
	parentPort?.postMessage({ ok: false, error: String(error) });
}
