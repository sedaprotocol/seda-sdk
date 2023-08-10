import { JSON } from "../../../node_modules/assemblyscript-json/assembly/index";
import { call_result_write, http_fetch } from "./bindings/env";
import { jsonArrToUint8Array } from "./json-utils";
import { PromiseStatus, FromBuffer } from "./promise";

export class HttpResponse implements FromBuffer<HttpResponse> {
  public result: Uint8Array | null = null;
  public bytes: Uint8Array = new Uint8Array(0);
  public contentLength: i64 = 0;
  public url: string = "";
  public status: i64 = 0;
  public headers: Map<string, string> = new Map();

  fromBuffer(buffer: Uint8Array): HttpResponse {
    const response = new HttpResponse();
    const value = <JSON.Obj>JSON.parse(buffer);

    const rawResponseBytes = value.getArr("bytes");
    if (rawResponseBytes) {
      response.bytes = jsonArrToUint8Array(rawResponseBytes);
    }

    const rawContentLength = value.getInteger("content_length");
    if (rawContentLength) {
      response.contentLength = rawContentLength.valueOf();
    }

    const rawStatus = value.getInteger("status");
    if (rawStatus) {
      response.status = rawStatus.valueOf();
    }

    const rawUrl = value.getString("url");
    if (rawUrl) {
      response.url = rawUrl.valueOf();
    }

    const rawHeaders = value.getObj("headers");
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

export class HttpFetchOptions {
  method: HttpFetchMethod = 'Get';
  headers: Map<string, string> = new Map();
  body: Uint8Array | null = null;

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

    obj.set("url", this.url);
    obj.set("options", this.options.toObject());

    return obj;
  }

  toString(): string {
    return this.toObject().toString();
  }
}

export function httpFetch(url: string, options: HttpFetchOptions = new HttpFetchOptions()): PromiseStatus<HttpResponse, HttpResponse> {
  const action = new HttpFetch(url, options);
  const actionStr = action.toString();

  const buffer = String.UTF8.encode(actionStr);
  const utf8ptr = changetype<usize>(buffer);

  const responseLength = http_fetch(utf8ptr, buffer.byteLength);
  const responseBuffer = new ArrayBuffer(responseLength);
  const responseBufferPtr = changetype<usize>(responseBuffer);

  call_result_write(responseBufferPtr, responseLength);

  const response = String.UTF8.decode(responseBuffer);

  return PromiseStatus.fromStr(response, new HttpResponse, new HttpResponse);
}
