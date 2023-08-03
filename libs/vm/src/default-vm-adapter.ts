import { HttpFetchAction, VmAdapter } from "./types/vm-adapter";
import fetch from "node-fetch";

export default class DefaultVmAdapter implements VmAdapter {
  async http_fetch(action: HttpFetchAction): Promise<Response> {
    console.log(action);

    return new Response();
  }
}
