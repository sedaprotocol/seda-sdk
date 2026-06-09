import type { Result } from "true-myth";
import type { VmError } from "../errors";
import type {
	HttpFetchAction,
	HttpFetchBatchAction,
	HttpFetchBatchResponse,
	HttpFetchResponse,
	ProxyHttpFetchAction,
	ProxyHttpFetchBatchAction,
	ProxyHttpFetchBatchResponse,
} from "./vm-actions";
import type { VmCallData } from "./vm-call-data.js";
import type { PromiseStatus } from "./vm-promise.js";

export interface VmAdapter {
	/**
	 * Allows the adapter to modify the call data before executing
	 * this can be used to inject arguments, environment variables, etc.
	 *
	 * @param input
	 */
	modifyVmCallData(input: VmCallData): VmCallData;

	/**
	 * Sets the process id in order to identify a vm call in the logs
	 *
	 * @param processId
	 */
	setProcessId(processId: string): void;

	/**
	 * Method to do a remote http fetch call
	 *
	 * @param action
	 */
	httpFetch(action: HttpFetchAction): Promise<PromiseStatus<HttpFetchResponse>>;

	/**
	 * Method to do a remote http fetch batch call
	 *
	 * @param action
	 */
	httpFetchBatch(action: HttpFetchBatchAction): Promise<HttpFetchBatchResponse>;

	/**
	 * Method to calculate the gas cost of a proxy http fetch call
	 *
	 * @param action
	 */
	getProxyHttpFetchGasCost(
		action: ProxyHttpFetchAction,
	): Promise<Result<bigint, Error>>;

	/**
	 * Method to do a remote proxy http fetch call
	 *
	 * @param action
	 */
	proxyHttpFetch(
		action: ProxyHttpFetchAction,
	): Promise<PromiseStatus<HttpFetchResponse>>;

	/**
	 * Method to do a remote proxy http fetch batch call
	 *
	 * @param action
	 */
	proxyHttpFetchBatch(
		action: ProxyHttpFetchBatchAction,
	): Promise<ProxyHttpFetchBatchResponse>;

	/**
	 * Method to get the current clock time
	 *
	 * @param mode
	 *
	 * 'monotonic' - The store-wide monotonic clock, which is defined as a clock measuring real time, whose value cannot be adjusted and which cannot have negative clock jumps. The epoch of this clock is undefined. The absolute time value of this clock therefore has no meaning.
	 * 'realtime' - the time since the Unix epoch (January 1, 1970 00:00:00 UTC)
	 *
	 * @returns the current clock time in milliseconds
	 */
	getClockTime(mode: "monotonic" | "realtime"): number;
}
