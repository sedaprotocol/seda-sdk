import { Readable, Stream } from "node:stream";
import { trySync } from "@seda-protocol/utils";
import fetch from "node-fetch";
import type { Result } from "true-myth";
import { VmError, VmErrorType } from "./errors.js";
import { readStream } from "./services/read-stream.js";
import type {
	HttpFetchAction,
	ProxyHttpFetchAction,
} from "./types/vm-actions.js";
import { HttpFetchResponse } from "./types/vm-actions.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import { VM_MODE_DR, VM_MODE_ENV_KEY } from "./types/vm-modes.js";
import { PromiseStatus } from "./types/vm-promise.js";
import type { VmCallData } from "./vm.js";

interface Options {
	fetchMock?: typeof fetch;
	maxResponseBytes?: number;
	totalHttpTimeLimit?: number;
}

export default class DataRequestVmAdapter implements VmAdapter {
	private processId?: string;
	private fetchFunction = fetch;
	private maxResponseBytes = 10 * 1024 * 1024; // 10MB
	private totalHttpTimeLimit = 20_000;
	private totalHttpTimeLeft = 20_000;

	constructor(private opts?: Options) {
		if (opts?.fetchMock) {
			this.fetchFunction = opts.fetchMock;
		}

		if (opts?.maxResponseBytes) {
			this.maxResponseBytes = opts.maxResponseBytes;
		}

		if (opts?.totalHttpTimeLimit) {
			this.totalHttpTimeLimit = opts.totalHttpTimeLimit;
			this.totalHttpTimeLeft = opts.totalHttpTimeLimit;
		}
	}

	modifyVmCallData(input: VmCallData): VmCallData {
		return {
			...input,
			allowedImports: [
				...(input.allowedImports ?? []),
				"args_get",
				"args_sizes_get",
				"proc_exit",
				"random_get",
				"fd_write",
				"environ_get",
				"environ_sizes_get",
				"clock_time_get",
			],
			envs: {
				...input.envs,
				[VM_MODE_ENV_KEY]: VM_MODE_DR,
			},
		};
	}

	setProcessId(processId: string) {
		this.processId = processId;
	}

	getProxyHttpFetchGasCost(
		_action: ProxyHttpFetchAction,
	): Promise<Result<bigint, Error>> {
		throw new VmError("Unimplemented");
	}

	proxyHttpFetch(
		_action: ProxyHttpFetchAction,
	): Promise<PromiseStatus<HttpFetchResponse>> {
		throw new VmError("Unimplemented");
	}

	async httpFetch(
		action: HttpFetchAction,
	): Promise<PromiseStatus<HttpFetchResponse>> {
		const url = trySync(() => new URL(action.url));
		if (url.isErr)
			return HttpFetchResponse.createRejectedPromise(
				`${action.url} is not a valid URL`,
			);

		if (url.value.protocol !== "http:" && url.value.protocol !== "https:") {
			return HttpFetchResponse.createRejectedPromise(
				`${action.url} is not http or https`,
			);
		}

		// Set up user and global timeouts.
		const abortController = new AbortController();

		const userTimeout = action.options.timeout_ms ?? 2_000;
		const userTimeoutMsg = `HTTP fetch time limit exceeded (${userTimeout}ms)`;
		const globalTimeoutMsg = `Global HTTP fetch time limit exceeded (${this.totalHttpTimeLimit}ms)`;

		let hasUserTimeout = false;
		let hasGlobalTimeout = false;

		const globalTimeoutId = setTimeout(() => {
			hasGlobalTimeout = true;
			abortController.abort(
				new VmError(globalTimeoutMsg, {
					type: VmErrorType.HttpFetchGlobalTimeout,
				}),
			);
		}, this.totalHttpTimeLeft);

		const userTimeoutId = setTimeout(() => {
			hasUserTimeout = true;
			abortController.abort(
				new VmError(userTimeoutMsg, {
					type: VmErrorType.HttpFetchTimeout,
				}),
			);
		}, userTimeout);

		const startTime = Date.now();

		try {
			if (this.totalHttpTimeLeft <= 0) {
				hasGlobalTimeout = true;
				throw new VmError(globalTimeoutMsg, {
					type: VmErrorType.HttpFetchGlobalTimeout,
				});
			}

			const response = await this.fetchFunction(new URL(action.url), {
				signal: abortController.signal,
				method: action.options.method.toUpperCase(),
				headers: action.options.headers,
				body: getBody(action),
			});

			// Clear timeouts and update total time left for next request.
			clearTimeout(globalTimeoutId);
			clearTimeout(userTimeoutId);

			const endTime = Date.now();
			const totalTime = endTime - startTime;
			this.totalHttpTimeLeft = this.totalHttpTimeLeft - totalTime;

			if (!response.body) throw new VmError("HTTP Body was already consumed");

			const readResult = await readStream(response.body, this.maxResponseBytes);
			if (readResult.isErr) throw new VmError(readResult.error.message);

			const httpResponse = new HttpFetchResponse({
				bytes: Array.from(readResult.value),
				content_length: response.size ?? 0,
				headers: Object.fromEntries(response.headers.entries()),
				status: response.status,
				url: response.url,
			});

			return PromiseStatus.fulfilled(httpResponse);
		} catch (error) {
			// Clear timeouts and update total time left for next request.
			clearTimeout(globalTimeoutId);
			clearTimeout(userTimeoutId);

			const endTime = Date.now();
			const totalTime = endTime - startTime;
			this.totalHttpTimeLeft = this.totalHttpTimeLeft - totalTime;

			// Construct an error message.
			let errorMsg = "";
			if (hasGlobalTimeout) {
				errorMsg = globalTimeoutMsg;
			} else if (hasUserTimeout) {
				errorMsg = userTimeoutMsg;
			} else {
				errorMsg = `${error}`;
			}

			console.error(`[${this.processId}] - @default-vm-adapter: `, errorMsg);

			return PromiseStatus.rejected(
				new HttpFetchResponse({
					bytes: Array.from(new TextEncoder().encode(errorMsg)),
					content_length: errorMsg.length,
					headers: {},
					status: 0,
					url: "",
				}),
			);
		}
	}
}

function getBody(action: HttpFetchAction) {
	if (!action.options.body) {
		return undefined;
	}

	const body = Buffer.from(action.options.body);
	// If the body is empty, we don't need to send it
	if (body.length === 0) {
		return undefined;
	}

	return body;
}
