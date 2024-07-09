import {
  callVm,
  DataRequestVmAdapter,
} from '@seda-protocol/vm';
import fetch from 'node-fetch';

export function executeDrWasm(
  wasmBinary: Buffer,
  inputs: string[],
  fetchMock?: typeof fetch
) {
  return callVm(
    {
      args: inputs,
      envs: {},
      binary: new Uint8Array(wasmBinary),
    },
    undefined,
    new DataRequestVmAdapter({ fetchMock })
  );
}
