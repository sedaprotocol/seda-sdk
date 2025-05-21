import { Readable, Stream } from "node:stream";
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
	requestTimeout?: number;
	maxResponseBytes?: number;
	totalHttpTimeLimit?: number;
}

export default class DataRequestVmAdapter implements VmAdapter {
	private processId?: string;
	private fetchFunction = fetch;
	private requestTimeout = 2_000;
	private maxResponseBytes = 10 * 1024 * 1024; // 10MB
	private totalHttpTimeLimit = 20_000;
	private totalHttpTimeLeft = 20_000;

	constructor(private opts?: Options) {
		if (opts?.fetchMock) {
			this.fetchFunction = opts.fetchMock;
		}

		if (opts?.requestTimeout) {
			this.requestTimeout = opts.requestTimeout;
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
		const abortController = new AbortController();
		const globalTimeoutMessage = `Total HTTP fetch time limit exceeded (${this.totalHttpTimeLimit}ms)`;
		const httpTimeoutMessage = "HTTP request has timed out";
		let httpTimeout = false;
		let httpTimeLimitTimeout = false;

		if (this.totalHttpTimeLeft <= 0) {
			throw new VmError(globalTimeoutMessage, {
				type: VmErrorType.HttpFetchGlobalTimeout,
			});
		}

		const httpTimeLimitTimeoutId = setTimeout(() => {
			httpTimeLimitTimeout = true;
			abortController.abort(
				new VmError(globalTimeoutMessage, {
					type: VmErrorType.HttpFetchGlobalTimeout,
				}),
			);
		}, this.totalHttpTimeLeft);

		const httpTimeoutId = setTimeout(() => {
			httpTimeout = true;
			abortController.abort(
				new VmError(httpTimeoutMessage, {
					type: VmErrorType.HttpFetchTimeout,
				}),
			);
		}, this.requestTimeout);

		const startTime = Date.now();

		try {
			const response = await this.fetchFunction(new URL(action.url), {
				signal: abortController.signal,
				method: action.options.method.toUpperCase(),
				headers: action.options.headers,
				body: getBody(action),
			});

			clearTimeout(httpTimeLimitTimeoutId);
			clearTimeout(httpTimeoutId);

			const endTime = Date.now();
			const totalTime = endTime - startTime;
			// Update the remaining time for the next request
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
			clearTimeout(httpTimeLimitTimeoutId);
			clearTimeout(httpTimeoutId);

			const endTime = Date.now();
			const totalTime = endTime - startTime;

			// Update the remaining time for the next request
			this.totalHttpTimeLeft = this.totalHttpTimeLeft - totalTime;

			// When we are timed out we should use the timeout message
			// Otherwise we use the error message
			const stringifiedError = httpTimeout ? httpTimeoutMessage : `${error}`;

			console.error(
				`[${this.processId}] - @default-vm-adapter: `,
				stringifiedError,
			);

			// When the global timeout was reached, we throw a timeout error and abort the VM
			if (httpTimeLimitTimeout) {
				throw new VmError(globalTimeoutMessage, {
					type: VmErrorType.HttpFetchGlobalTimeout,
				});
			}

			return PromiseStatus.rejected(
				new HttpFetchResponse({
					bytes: Array.from(new TextEncoder().encode(stringifiedError)),
					content_length: stringifiedError.length,
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
