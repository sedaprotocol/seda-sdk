import { JSON } from 'json-as/assembly';
import { call_result_write, http_fetch } from './bindings/seda_v1';
import { jsonArrToUint8Array, uint8arrayToJsonArray } from './json-utils';
import { PromiseStatus, FromBuffer } from './promise';

@json
class InnerResponse {
  bytes!: u8[];
  content_length!: i64;
  status!: i64;
  url!: string;
  headers!: Map<string, string>;
}

/**
 * Response of an httpFetch call
 */
@json
export class HttpResponse implements FromBuffer<HttpResponse> {
  /**
   * Raw result of the HTTP fetch. (usually not used)
   */
  public result: Uint8Array | null = null;
  /**
   * The response body result. This can be used to convert to JSON, text, etc.
   */
  public bytes: Uint8Array = new Uint8Array(0);
  /**
   * The length of the content
   */
  public contentLength: i64 = 0;
  /**
   * The URL that was fetched (when it needs to follow redirects)
   */
  public url: string = '';
  /**
   * The HTTP status code
   */
  public status: i64 = 0;
  /**
   * The headers returned
   */
  public headers: Map<string, string> = new Map();

  fromBuffer(buffer: Uint8Array): HttpResponse {
    const response = new HttpResponse();
    const value = JSON.parse<InnerResponse>(String.UTF8.decode(buffer.buffer));

    if (value.bytes) {
      response.bytes = jsonArrToUint8Array(<u8[]>value.bytes);
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

    response.result = buffer;
    return response;
  }

  toString(): string {
    const response = new InnerResponse();
    
    response.bytes = uint8arrayToJsonArray(this.bytes);
    response.content_length = this.contentLength;
    response.headers = this.headers;
    response.status = this.status;
    response.url = this.url;

    return JSON.stringify(response);
  }
}

export type HttpFetchMethod = string;

/**
 * HTTP Fetch options
 * @example
 * ```ts
 * const headers = new Map<string, string>();
 * headers.set('x-header', 'example');
 *
 * const options = new HttpFetchOptions();
 * options.method = "Post";
 * options.headers = headers;
 * // Do something with the body
 * options.body = new Uint8Array(10);
 *
 * const response = httpFetch("https://swapi.dev/api/planets/1/", options);
 * ```
 */
@json
export class HttpFetchOptions {
  /**
   * HTTP Method (Get, Post, Patch, etc.)
   */
  method: HttpFetchMethod = 'Get';

  /**
   * Headers to send along. Key -> Value
   * ex: headers.set('Content-Type', 'application/json')
   */
  headers: Map<string, string> = new Map();

  /**
   * Body encoded in bytes to send along in a POST, PATCH, etc.
   */
  body: Uint8Array | null = null;
}

@json
class HttpFetch {
  url: string;
  options: HttpFetchOptions;

  constructor(url: string, options: HttpFetchOptions = new HttpFetchOptions()) {
    this.url = url;
    this.options = options;
  }
}

/**
 * Executes a HTTP call (similiar to the Fetch API from the Web API)
 *
 * @param {string} url The URL which to call
 * @param {HttpFetchOptions} options Options to modify the behaviour of the HTTP call
 * @returns {PromiseStatus<HttpResponse, HttpResponse>} Returns a HttpResponse instance for both fulfilled and rejected case with info about the HTTP call
 * @example
 * ```ts
 * const response = httpFetch("https://swapi.dev/api/planets/1/");
 * const fulfilled = response.fulfilled;
 *
 * if (fulfilled !== null) {
 *   const data = String.UTF8.decode(fulfilled.bytes.buffer);
 *   // Do something with data
 * } else {
 *   // Error occured
 * }
 * ```
 */
export function httpFetch(
  url: string,
  options: HttpFetchOptions = new HttpFetchOptions()
): PromiseStatus<HttpResponse, HttpResponse> {
  const action = new HttpFetch(url, options);
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
    new HttpResponse()
  );
}
