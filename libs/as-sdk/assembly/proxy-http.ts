import { JSON } from "json-as/assembly";
import { call_result_write, proxy_http_fetch } from "./bindings/seda_v1";
import { HttpFetchAction, HttpFetchOptions, HttpResponse } from "./http";
import { PromiseStatus } from "./promise";

export function proxyHttpFetch(
	url: string,
	options: HttpFetchOptions = new HttpFetchOptions(),
): PromiseStatus<HttpResponse, HttpResponse> {
	const action = new HttpFetchAction(url, options);
	const actionStr = JSON.stringify(action);

	const buffer = String.UTF8.encode(actionStr);
	const utf8ptr = changetype<usize>(buffer);

	const responseLength = proxy_http_fetch(utf8ptr, buffer.byteLength);
	const responseBuffer = new ArrayBuffer(responseLength);
	const responseBufferPtr = changetype<usize>(responseBuffer);

	call_result_write(responseBufferPtr, responseLength);

	const response = String.UTF8.decode(responseBuffer);

	return PromiseStatus.fromStr(
		response,
		new HttpResponse(),
		new HttpResponse(),
	);
}
