import { Result } from "true-myth";
import type {
	HttpFetchAction,
	HttpFetchBatchAction,
	ProxyHttpFetchAction,
	ProxyHttpFetchBatchAction,
} from "./types/vm-actions.js";
import {
	HttpFetchBatchResponse,
	HttpFetchResponse,
	ProxyHttpFetchBatchResponse,
} from "./types/vm-actions.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import type { VmCallData } from "./types/vm-call-data.js";
import { VM_MODE_ENV_KEY, VM_MODE_TALLY } from "./types/vm-modes.js";
import { PromiseStatus } from "./types/vm-promise.js";

export default class TallyVmAdapter implements VmAdapter {
	private processId?: string;

	modifyVmCallData(input: VmCallData): VmCallData {
		return {
			...input,
			allowedImports: [
				...(input.allowedImports ?? []),
				"args_get",
				"args_sizes_get",
				"proc_exit",
				"fd_write",
				"environ_get",
				"environ_sizes_get",
			],
			envs: {
				...input.envs,
				[VM_MODE_ENV_KEY]: VM_MODE_TALLY,
			},
		};
	}

	async getProxyHttpFetchGasCost(
		_action: ProxyHttpFetchAction,
	): Promise<Result<bigint, Error>> {
		return Result.err(new Error("proxy_http_fetch is not allowed in tally"));
	}

	async proxyHttpFetch(
		_action: ProxyHttpFetchAction,
	): Promise<PromiseStatus<HttpFetchResponse>> {
		const error = new TextEncoder().encode(
			"proxy_http_fetch is not allowed in tally",
		);

		return PromiseStatus.rejected(
			new HttpFetchResponse({
				bytes: Array.from(error),
				content_length: error.length,
				headers: {},
				status: 0,
				url: "",
			}),
		);
	}

	setProcessId(processId: string) {
		this.processId = processId;
	}

	async httpFetch(
		_action: HttpFetchAction,
	): Promise<PromiseStatus<HttpFetchResponse>> {
		const error = new TextEncoder().encode(
			"http_fetch is not allowed in tally",
		);

		return PromiseStatus.rejected(
			new HttpFetchResponse({
				bytes: Array.from(error),
				content_length: error.length,
				headers: {},
				status: 0,
				url: "",
			}),
		);
	}

	async httpFetchBatch(
		action: HttpFetchBatchAction,
	): Promise<HttpFetchBatchResponse> {
		const responses = await Promise.all(
			action.requests.map((request) =>
				this.httpFetch({ ...request, type: "http-fetch-action" }),
			),
		);
		return new HttpFetchBatchResponse(responses);
	}

	async proxyHttpFetchBatch(
		action: ProxyHttpFetchBatchAction,
	): Promise<ProxyHttpFetchBatchResponse> {
		const responses = await Promise.all(
			action.requests.map((request) =>
				this.proxyHttpFetch({
					url: request.url,
					options: request.options,
					public_key: request.public_key,
					type: "proxy-http-fetch-action",
				}),
			),
		);
		return new ProxyHttpFetchBatchResponse(responses);
	}

	getClockTime(mode: "monotonic" | "realtime"): number {
		if (mode === "monotonic") {
			return performance.now();
		}

		// Default to realtime if no mode is provided
		return Date.now();
	}
}
