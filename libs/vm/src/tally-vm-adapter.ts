import type { HttpFetchAction } from './types/vm-actions';
import { HttpFetchResponse } from './types/vm-actions.js';
import type { VmAdapter } from './types/vm-adapter';
import { PromiseStatus } from './types/vm-promise.js';
import type { VmCallData } from './vm';

export default class TallyVmAdapter implements VmAdapter {
  private processId?: string;

  modifyVmCallData(input: VmCallData): VmCallData {
    return {
      ...input,
      envs: {
        ...input.envs,
        VM_MODE: 'tally'
      }
    };
  }

  setProcessId(processId: string) {
    this.processId = processId;
  }

  async httpFetch(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _action: HttpFetchAction
  ): Promise<PromiseStatus<HttpFetchResponse>> {
    const error = new TextEncoder().encode('http_fetch is not allowed in tally');

    return PromiseStatus.rejected(
      new HttpFetchResponse({
        bytes: Array.from(error),
        content_length: error.length,
        headers: {},
        status: 0,
        url: '',
      })
    );
  }
}
