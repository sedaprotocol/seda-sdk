import {
	PromiseStatus,
	PromiseStatusResult,
	type ToBuffer,
} from "./vm-promise";

export enum HttpFetchMethod {
	Options = "Options",
	Get = "Get",
	Post = "Post",
	Put = "Put",
	Delete = "Delete",
	Head = "Head",
	Trace = "Trace",
	Connect = "Connect",
	Patch = "Patch",
}

export interface HttpFetchOptions {
	method: HttpFetchMethod;
	headers: { [key: string]: string };
	body?: Uint8Array;
}

export type VmAction =
	| HttpFetchAction
	| ProxyHttpFetchAction
	| ProxyHttpFetchGasCostAction;

export interface HttpFetchAction {
	url: string;
	options: HttpFetchOptions;
	type: "http-fetch-action";
}

export function isHttpFetchAction(action: VmAction): action is HttpFetchAction {
	return action.type === "http-fetch-action";
}

export interface ProxyHttpFetchAction extends Omit<HttpFetchAction, "type"> {
	public_key?: string;
	type: "proxy-http-fetch-action";
}

export function isProxyHttpFetchAction(
	action: VmAction,
): action is ProxyHttpFetchAction {
	return action.type === "proxy-http-fetch-action";
}

export interface ProxyHttpFetchGasCostAction {
	fetchAction: ProxyHttpFetchAction;
	type: "proxy-http-fetch-gas-cost-action";
}

export function isProxyHttpFetchGasCostAction(
	action: VmAction,
): action is ProxyHttpFetchGasCostAction {
	return action.type === "proxy-http-fetch-gas-cost-action";
}

export interface HttpFetchResponseData {
	/** HTTP Status code */
	status: number;

	/** Response headers */
	headers: { [key: string]: string };

	/** Response body in bytes */
	bytes: number[];

	/** The final URL that was resolved */
	url: string;

	/** The byte length of the response */
	content_length: number;
}

export class HttpFetchResponse implements ToBuffer {
	constructor(public data: HttpFetchResponseData) {}

	toBuffer(): Uint8Array {
		return new TextEncoder().encode(JSON.stringify(this.data));
	}

	static createRejectedPromise(
		error: string,
	): PromiseStatus<HttpFetchResponse> {
		const errorBytes = Array.from(new TextEncoder().encode(error));

		return PromiseStatus.rejected(
			new HttpFetchResponse({
				bytes: errorBytes,
				content_length: errorBytes.length,
				headers: {},
				status: 0,
				url: "",
			}),
		);
	}

	static fromPromise(
		input: PromiseStatus<HttpFetchResponse>,
	): HttpFetchResponse {
		if (input.value.Fulfilled) {
			const fulfilled = Buffer.from(input.value.Fulfilled).toString("utf-8");
			return new HttpFetchResponse(JSON.parse(fulfilled));
		}

		if (input.value.Rejected) {
			const rejected = Buffer.from(input.value.Rejected).toString("utf-8");
			return new HttpFetchResponse(JSON.parse(rejected));
		}

		return new HttpFetchResponse({
			bytes: [],
			content_length: 0,
			headers: {},
			status: 0,
			url: "",
		});
	}
}
