import { callVm, TallyVmAdapter } from '@seda-protocol/vm';
import { createMockTallyArgs } from './create-mock-tally-args';

type TallyArgs = Parameters<typeof createMockTallyArgs>

export function executeTallyWasm(wasmBinary: Buffer, ...tallyArgs: TallyArgs) {
  const args = createMockTallyArgs(...tallyArgs);

  return callVm(
    {
      args,
      envs: {},
      binary: new Uint8Array(wasmBinary),
    },
    undefined,
    new TallyVmAdapter()
  );
}
