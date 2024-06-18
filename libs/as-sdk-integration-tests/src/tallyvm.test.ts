import { TallyVmAdapter, callVm } from '../../../dist/libs/vm/src/index';
import { readFile } from 'node:fs/promises';

describe('TallyVm', () => {
  it('should run in dr vm mode by default', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );
    const result = await callVm({
      args: ['testTallyVmMode'],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    });

    expect(result.resultAsString).toEqual('dr');
    expect(result.exitCode).toBe(1);
  });

  it('should run in tally vm mode with the adapter', async () => {
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

  it('should fail when the reveals and consensus arrays are not the same length', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );

    const reveals = [
      {
        salt: [5, 0, 1, 2, 3],
        exit_code: 1,
        gas_used: '200000',
        reveal: [1, 2, 3, 3, 3, 3, 3],
      },
      {
        salt: [5, 0, 1, 2, 3],
        exit_code: 1,
        gas_used: '1336',
        reveal: [1, 2, 3, 3, 3, 3, 3],
      },
    ];
    const consensus = [0];

    const result = await callVm(
      {
        args: [
          'testTallyVmReveals',
          JSON.stringify(reveals),
          JSON.stringify(consensus),
        ],
        envs: {},
        binary: new Uint8Array(wasmBinary),
      },
      undefined,
      new TallyVmAdapter()
    );

    expect(result.exitCode).toBe(255);
    expect(result.stderr.length).toBeGreaterThan(1);
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
        salt: [4, 1, 2, 3],
        exit_code: 1,
        gas_used: '1336',
        reveal: [9, 2, 3, 3, 3, 3, 3],
      },
    ];
    const consensus = [0, 0];

    const result = await callVm(
      {
        args: [
          'testTallyVmReveals',
          JSON.stringify(reveals),
          JSON.stringify(consensus),
        ],
        envs: {},
        binary: new Uint8Array(wasmBinary),
      },
      undefined,
      new TallyVmAdapter()
    );

    expect(result.exitCode).toBe(0);
    expect(result.resultAsString).toBe(
      '[{"salt":[0,1,2,3],"exit_code":0,"gas_used":"200000","reveal":[0,2,3,3,3,3,3],"inConsensus":0},{"salt":[4,1,2,3],"exit_code":1,"gas_used":"1336","reveal":[9,2,3,3,3,3,3],"inConsensus":0}]'
    );
  });

  it('should provide a convenience method to filter out outliers.', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );

    const reveals = [
      {
        salt: [3],
        exit_code: 1,
        gas_used: '200000',
        reveal: [1],
      },
      {
        salt: [2],
        exit_code: 0,
        gas_used: '1336',
        reveal: [2],
      },
      {
        salt: [1],
        exit_code: 0,
        gas_used: '1346',
        reveal: [3],
      },
    ];
    const consensus = [1, 0, 0];

    const result = await callVm(
      {
        args: [
          'testTallyVmRevealsFiltered',
          JSON.stringify(reveals),
          JSON.stringify(consensus),
        ],
        envs: {},
        binary: new Uint8Array(wasmBinary),
      },
      undefined,
      new TallyVmAdapter()
    );

    expect(result.exitCode).toBe(0);
    expect(result.resultAsString).toBe(
      '[{"salt":[2],"exit_code":0,"gas_used":"1336","reveal":[2],"inConsensus":0},{"salt":[1],"exit_code":0,"gas_used":"1346","reveal":[3],"inConsensus":0}]'
    );
  });
});
