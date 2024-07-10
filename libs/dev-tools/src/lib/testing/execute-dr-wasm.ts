import {
  callVm,
  DataRequestVmAdapter,
} from '@seda-protocol/vm';
import fetch from 'node-fetch';

export function executeDrWasm(
  wasmBinary: Buffer,
  inputs: Buffer,
  fetchMock?: typeof fetch
) {
  return callVm(
    {
      args: [inputs.toString('hex')],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    },
    undefined,
    new DataRequestVmAdapter({ fetchMock })
  );
}
