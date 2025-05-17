import type { Result } from "true-myth";
import type { VmError } from "../errors";
import type { VmCallData } from "../vm";
import type {
	HttpFetchAction,
	HttpFetchResponse,
	ProxyHttpFetchAction,
} from "./vm-actions";
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
}
