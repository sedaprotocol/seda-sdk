import type { HttpFetchAction, HttpFetchResponse } from "./vm-actions";
import { PromiseStatus } from "./vm-promise.js";


export interface VmAdapter {
  setProcessId(processId: string): void,
  httpFetch(action: HttpFetchAction): Promise<PromiseStatus<HttpFetchResponse>>;
}
