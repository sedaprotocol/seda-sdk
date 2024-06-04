import { TallyVmAdapter, callVm } from '../../../dist/libs/vm';
import { readFile } from 'node:fs/promises';

describe('TallyVm', () => {
  it('should run in tally vm mode', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );
    const result = await callVm(
      {
        args: ['testTallyVmMode'],
        envs: {},
        binary: new Uint8Array(wasmBinary),
      },
      undefined,
      new TallyVmAdapter()
    );

    expect(result.resultAsString).toEqual('tally');
    expect(result.exitCode).toBe(0);
  });

  it('should fail to make an http call', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );
    const result = await callVm(
      {
        args: ['testTallyVmHttp'],
        envs: {},
        binary: new Uint8Array(wasmBinary),
      },
      undefined,
      new TallyVmAdapter()
    );

    expect(result.resultAsString).toEqual('http_fetch is not allowed in tally');
    expect(result.exitCode).toBe(0);
  });
});
