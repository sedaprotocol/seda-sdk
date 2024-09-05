import type { VmCallData } from "../vm";
import type { HttpFetchAction, HttpFetchResponse } from "./vm-actions";
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
}
