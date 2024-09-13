import { JSON } from "json-as/assembly";
import { call_result_write, http_fetch } from "./bindings/seda_v1";
import { Bytes } from "./bytes";
import { bytesToJsonArray, jsonArrToUint8Array } from "./json-utils";
import { FromBuffer, PromiseStatus } from "./promise";

@json
export class SerializableHttpResponse {
	bytes!: u8[];
	content_length!: i64;
	status!: i64;
	url!: string;
	headers!: Map<string, string>;
}

/**
 * The response of an {@linkcode httpFetch} call. Contains all the information returned by the
 * requested endpoint.
 *
 * @category HTTP
 */
@json
export class HttpResponse implements FromBuffer<HttpResponse> {
	/** @hidden */
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor() {}

	/**
	 * The response body result. This can be used to convert to JSON, text, etc.
	 */
	public bytes: Bytes = Bytes.empty();
	/**
	 * The length of the content
	 */
	public contentLength: i64 = 0;
	/**
	 * The URL that was fetched (when it needs to follow redirects)
	 */
	public url: string = "";
	/**
	 * The HTTP status code
	 */
	public status: i64 = 0;
	/**
	 * The response headers
	 */
	public headers: Map<string, string> = new Map();

	/** @hidden */
	static fromSerializable(value: SerializableHttpResponse): HttpResponse {
		const response = new HttpResponse();

		if (value.bytes) {
			response.bytes.value = jsonArrToUint8Array(<u8[]>value.bytes);
		}

		if (value.content_length) {
			response.contentLength = value.content_length;
		}

		if (value.status) {
			response.status = value.status;
		}

		if (value.url) {
			response.url = <string>value.url;
		}

		const rawHeaders = value.headers;
		if (rawHeaders) {
			const keys = rawHeaders.keys();
			const values = rawHeaders.values();
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const value = values[i];

				if (value) {
					response.headers.set(key, value);
				}
			}
		}

		return response;
	}

	/** @hidden */
	fromBuffer(buffer: Uint8Array): HttpResponse {
		const value = JSON.parse<SerializableHttpResponse>(
			String.UTF8.decode(buffer.buffer),
		);

		return HttpResponse.fromSerializable(value);
	}
}

/**
 * @hidden As it's not relevant for the generated documentation
 */
export type HttpFetchMethod = "Get";

/**
 * Request options to pass to {@linkcode httpFetch}.
 *
 * @example
 * ```ts
 * const headers = new Map<string, string>();
 * headers.set('x-header', 'example');
 *
 * const options = new HttpFetchOptions();
 * options.method = "Post";
 * options.headers = headers;
 * options.body = Bytes.fromUtf8String('{"value":"test"}');
 *
 * const response = httpFetch("https://swapi.dev/api/planets/1/", options);
 * ```
 * @category HTTP
 */
@json
export class HttpFetchOptions {
	/**
	 * HTTP method: "GET", "POST", "PATCH", etc.
	 */
	method: HttpFetchMethod = "Get";

	/**
	 * Headers to send along. Key -> Value
	 * ex: headers.set('Content-Type', 'application/json')
	 */
	headers: Map<string, string> = new Map();

	/**
	 * Body encoded in bytes to send along in a POST, PATCH, etc.
	 */
	body: Bytes | null = null;
}

@json
export class SerializableHttpFetchOptions {
	method!: string;
	headers!: Map<string, string>;
	body: u8[] = [];
}

@json
export class HttpFetchAction {
	url: string;
	options: SerializableHttpFetchOptions;

	constructor(url: string, options: HttpFetchOptions) {
		this.url = url;
		this.options = new SerializableHttpFetchOptions();

		this.options.method = options.method;
		this.options.headers = options.headers;
		this.options.body = bytesToJsonArray(options.body);
	}
}

/**
 * Executes a HTTP call (similiar to the Fetch API from the Web API)
 *
 * @category HTTP
 *
 * @param url The URL to send the request to
 * @param options Options to modify the behaviour of the HTTP call
 * @returns Returns a HttpResponse instance for both fulfilled and rejected case with info about the HTTP call
 * @example
 * ```ts
 * const response = httpFetch("https://swapi.dev/api/planets/1/");
 *
 * if (response.isFulfilled()) {
 *   const data = response.unwrap().bytes.toUtf8String();
 *   // Do something with data
 * } else {
 *   // Error occured
 * }
 * ```
 */
export function httpFetch(
	url: string,
	options: HttpFetchOptions = new HttpFetchOptions(),
): PromiseStatus<HttpResponse, HttpResponse> {
	const action = new HttpFetchAction(url, options);
	const actionStr = JSON.stringify(action);

	const buffer = String.UTF8.encode(actionStr);
	const utf8ptr = changetype<usize>(buffer);

	const responseLength = http_fetch(utf8ptr, buffer.byteLength);
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
