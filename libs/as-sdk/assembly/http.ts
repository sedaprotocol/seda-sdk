import { JSON } from 'assemblyscript-json/assembly';
import { call_result_write, http_fetch } from './bindings/env';
import { jsonArrToUint8Array } from './json-utils';
import { PromiseStatus, FromBuffer } from './promise';

/**
 * Response of an httpFetch call
 */
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
    const value = <JSON.Obj>JSON.parse(buffer);

    const rawResponseBytes = value.getArr('bytes');
    if (rawResponseBytes) {
      response.bytes = jsonArrToUint8Array(rawResponseBytes);
    }

    const rawContentLength = value.getInteger('content_length');
    if (rawContentLength) {
      response.contentLength = rawContentLength.valueOf();
    }

    const rawStatus = value.getInteger('status');
    if (rawStatus) {
      response.status = rawStatus.valueOf();
    }

    const rawUrl = value.getString('url');
    if (rawUrl) {
      response.url = rawUrl.valueOf();
    }

    const rawHeaders = value.getObj('headers');
    if (rawHeaders) {
      for (let i = 0; i < rawHeaders.keys.length; i++) {
        const key = rawHeaders.keys[i];
        const value = rawHeaders.getString(key);

        if (value) {
          response.headers.set(key, value.valueOf());
        }
      }
    }

    response.result = buffer;
    return response;
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

  /**
   * Converts the class to an object (internal use)
   *
   * @returns {JSON.Obj} A JSON object
   */
  toObject(): JSON.Obj {
    const obj = JSON.Value.Object();
    const headers = JSON.Value.Object();
    const headerKeys = this.headers.keys();

    for (let i = 0; i < headerKeys.length; i++) {
      const headerKey = headerKeys[i];
      const headerValue = this.headers.get(headerKey);

      headers.set(headerKey, headerValue);
    }

    obj.set('headers', headers);
    obj.set('method', this.method);

    if (this.body !== null) {
      obj.set('body', this.body);
    }

    return obj;
  }
}

class HttpFetch {
  url: string;
  options: HttpFetchOptions;

  constructor(url: string, options: HttpFetchOptions = new HttpFetchOptions()) {
    this.url = url;
    this.options = options;
  }

  toObject(): JSON.Obj {
    const obj = JSON.Value.Object();

    obj.set('url', this.url);
    obj.set('options', this.options.toObject());

    return obj;
  }

  toString(): string {
    return this.toObject().toString();
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
  const actionStr = action.toString();

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
