import { Result } from "true-myth";
import { VmError } from "./errors.js";
import type {
	HttpFetchAction,
	ProxyHttpFetchAction,
	StorageDeleteAction,
	StorageReadAction,
	StorageReadResponse,
	StorageWriteAction,
} from "./types/vm-actions.js";
import { HttpFetchResponse } from "./types/vm-actions.js";
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

	getClockTime(mode: "monotonic" | "realtime"): number {
		if (mode === "monotonic") {
			return performance.now();
		}

		// Default to realtime if no mode is provided
		return Date.now();
	}

	async _storageRead(
		action: StorageReadAction,
	): Promise<PromiseStatus<StorageReadResponse>> {
		return this.storageRead(action);
	}

	async storageRead(
		action: StorageReadAction,
	): Promise<PromiseStatus<StorageReadResponse>> {
		throw new VmError("unimplemented");
	}

	async _storageWrite(
		action: StorageWriteAction,
	): Promise<PromiseStatus<void>> {
		return this.storageWrite(action);
	}

	async storageWrite(action: StorageWriteAction): Promise<PromiseStatus<void>> {
		throw new VmError("unimplemented");
	}

	async _storageDelete(
		action: StorageDeleteAction,
	): Promise<PromiseStatus<void>> {
		return this.storageDelete(action);
	}

	async storageDelete(
		action: StorageDeleteAction,
	): Promise<PromiseStatus<void>> {
		throw new VmError("unimplemented");
	}
}
