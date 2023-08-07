import type { ToBuffer } from "./vm-promise";

enum HttpFetchMethod {
  Options = 'Options',
  Get = 'Get',
  Post = 'Post',
  Put = 'Put',
  Delete = 'Delete',
  Head = 'Head',
  Trace = 'Trace',
  Connect = 'Connect',
  Patch = 'Patch',
}

export interface HttpFetchOptions {
  method: HttpFetchMethod;
  headers: { [key: string]: string };
  body?: Uint8Array;
}

export interface HttpFetchAction {
  url: string;
  options: HttpFetchOptions;
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
}

export type VmAction = HttpFetchAction;
