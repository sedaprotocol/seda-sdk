import { JSON } from "json-as/assembly";
import { call_result_write, proxy_http_fetch } from "./bindings/seda_v1";
import { Bytes } from "./bytes";
import { keccak256 } from "./crypto";
import { HttpFetchAction, HttpFetchOptions, HttpResponse } from "./http";
// Is used in the transform (because ProxyHttpFetchAction extends from HttpFetchAction)
import { SerializableHttpFetchOptions } from "./http";
import { PromiseStatus } from "./promise";

@json
export class ProxyHttpFetchAction extends HttpFetchAction {
	@omitnull()
	public_key: string | null = null;

	constructor(
		url: string,
		publicKey: string | null,
		options: HttpFetchOptions,
	) {
		super(url, options);
		this.public_key = publicKey;
	}
}

/**
 * Calls a Data Proxy Node the same way httpFetch does, but checks the signature and
 *
 * @category HTTP
 *
 * @param url The URL of the Data Proxy Node you want to access
 * @param publicKey Optional: The public key of the proxy node, verifies if the signature came from this public key
 * @param options Optional: Allows you to set headers, method, body
 * @returns Promise with information about the response
 * @example
 * ```ts
 * const response = proxyHttpFetch("https://swapi.dev/api/planets/1/");
 *
 * if (response.ok) {
 *   const data = response.bytes.toUtf8String();
 *   // Do something with data
 * } else {
 *   // Error occured
 * }
 * ```
 */
export function proxyHttpFetch(
	url: string,
	publicKey: string | null = null,
	options: HttpFetchOptions = new HttpFetchOptions(),
): HttpResponse {
	const action = new ProxyHttpFetchAction(url, publicKey, options);
	const actionStr = JSON.stringify(action);

	const buffer = String.UTF8.encode(actionStr);
	const utf8ptr = changetype<usize>(buffer);

	const responseLength = proxy_http_fetch(utf8ptr, buffer.byteLength);
	const responseBuffer = new ArrayBuffer(responseLength);
	const responseBufferPtr = changetype<usize>(responseBuffer);

	call_result_write(responseBufferPtr, responseLength);

	const response = String.UTF8.decode(responseBuffer);

	const promise = PromiseStatus.fromStr(
		response,
		new HttpResponse(),
		new HttpResponse(),
	);

	if (promise.isFulfilled()) {
		return promise.unwrap();
	}

	return promise.unwrapRejected();
}

/**
 * Generates the message which the data proxy hashed and signed. This can be useful when you need to verify
 * the data proxy signature in the tally phase. With this message there is no need to include the entire request
 * and response data in the execution result.
 *
 * @category HTTP
 *
 * @example
 * ```ts
 * @json
 * class ApiResponse {
 *   name!: string;
 * }
 *
 * @json
 * class ExecutionResult {
 *   name!: string;
 *   proxyMessage!: string;
 * }
 *
 * const url = "https://swapi.dev/api/planets/1/";
 * const response = proxyHttpFetch(url);
 *
 * if (response.ok) {
 *   const proxyMessage = generateProxyHttpSigningMessage(url, "GET", Bytes.empty(), response.bytes);
 *   const data = response.bytes.toJSON<ApiResponse>();
 *
 *   Process.success(Bytes.fromJSON<>({ name: data.name, proxyMessage: proxyMessage }));
 * } else {
 *   // Error occured
 * }
 * ```
 * @param requestUrl
 * @param requestMethod
 * @param requestBody
 * @param responseBody
 * @returns the message that the data proxy should have hashed and signed
 */
export function generateProxyHttpSigningMessage(
	requestUrl: string,
	requestMethod: string,
	requestBody: Bytes,
	responseBody: Bytes,
): Bytes {
	const requestUrlHash = keccak256(Bytes.fromUtf8String(requestUrl));
	const requestMethodHash = keccak256(
		Bytes.fromUtf8String(requestMethod.toUpperCase()),
	);
	const requestBodyHash = keccak256(requestBody);
	const responseBodyHash = keccak256(responseBody);

	return Bytes.concat([
		requestUrlHash,
		requestMethodHash,
		requestBodyHash,
		responseBodyHash,
	]);
}
