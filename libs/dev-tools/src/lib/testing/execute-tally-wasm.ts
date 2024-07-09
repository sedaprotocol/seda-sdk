import { callVm, TallyVmAdapter } from '@seda-protocol/vm';

export function executeTallyWasm(wasmBinary: Buffer, inputs: string[]) {
  return callVm(
    {
      args: inputs,
      envs: {},
      binary: new Uint8Array(wasmBinary),
    },
    undefined,
    new TallyVmAdapter()
  );
}
