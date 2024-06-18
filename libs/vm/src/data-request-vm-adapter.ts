import type { HttpFetchAction } from './types/vm-actions.js';
import { HttpFetchResponse } from './types/vm-actions.js';
import type { VmAdapter } from './types/vm-adapter.js';
import { VM_MODE_ENV_KEY, VM_MODE_DR } from "./types/vm-modes.js";
import fetch from 'node-fetch';
import { PromiseStatus } from './types/vm-promise.js';
import { VmCallData } from './vm.js';

export default class DataRequestVmAdapter implements VmAdapter {
  private processId?: string;

  modifyVmCallData(input: VmCallData): VmCallData {
    return {
      ...input,
      envs: {
        ...input.envs,
        [VM_MODE_ENV_KEY]: VM_MODE_DR,
      },
    };
  }

  setProcessId(processId: string) {
      this.processId = processId;
  }

  async httpFetch(action: HttpFetchAction): Promise<PromiseStatus<HttpFetchResponse>> {
    try {
      const response = await fetch(new URL(action.url), {
        method: action.options.method.toUpperCase(),
        headers: action.options.headers,
        body: action.options.body
          ? Buffer.from(action.options.body)
          : undefined,
      });

      const bufferResponse = await response.arrayBuffer();
      const httpResponse = new HttpFetchResponse({
        bytes: Array.from(new Uint8Array(bufferResponse)),
        content_length: response.size,
        headers: Object.fromEntries(response.headers.entries()),
        status: response.status,
        url: response.url,
      });

      return PromiseStatus.fulfilled(httpResponse);
    } catch (error) {
      const stringifiedError = '' + error;

      console.error(`[${this.processId}] - @default-vm-adapter: `, stringifiedError);

      return PromiseStatus.rejected(new HttpFetchResponse({
        bytes: Array.from(new TextEncoder().encode(stringifiedError)),
        content_length: stringifiedError.length,
        headers: {},
        status: 0,
        url: '',
      }));
    }
  }
}
