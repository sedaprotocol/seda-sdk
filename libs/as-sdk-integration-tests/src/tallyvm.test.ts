import { TallyVmAdapter, callVm } from '../../../dist/libs/vm/src/index';
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

  it('should be able to parse the reveals', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );

    const reveals = [
      {
        salt: [0, 1, 2, 3],
        exit_code: 0,
        gas_used: '200000',
        reveal: [0, 2, 3, 3, 3, 3, 3],
      },
      {
        salt: [0, 1, 2, 3],
        exit_code: 0,
        gas_used: '1336',
        reveal: [0, 2, 3, 3, 3, 3, 3],
      },
    ];

    const result = await callVm(
      {
        args: ['testTallyVmReveals', JSON.stringify(reveals)],
        envs: {},
        binary: new Uint8Array(wasmBinary),
      },
      undefined,
      new TallyVmAdapter()
    );

    console.log(result);

    expect(result.exitCode).toBe(1);
  });
});
