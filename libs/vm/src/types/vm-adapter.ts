enum HttpFetchMethod {
    Options,
    Get,
    Post,
    Put,
    Delete,
    Head,
    Trace,
    Connect,
    Patch,
}

export interface HttpFetchOptions {
  method: HttpFetchMethod,
  headers: Map<string, string>,
  body?: Uint8Array,
}

export interface HttpFetchAction {
  url: string,
  options: HttpFetchOptions,
}

export interface VmAdapter {
  http_fetch(action: HttpFetchAction): Promise<Response>;
}
