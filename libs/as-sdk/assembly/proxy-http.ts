import { JSON } from 'json-as/assembly';
import { HttpFetchOptions, HttpFetch, HttpResponse } from "./http";
import { call_result_write, proxy_http_fetch } from './bindings/seda_v1';
import { PromiseStatus } from './promise';

export function proxyHttpFetch(url: string, options: HttpFetchOptions = new HttpFetchOptions()): PromiseStatus<HttpResponse, HttpResponse> {
    const action = new HttpFetch(url, options);
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