import { expect, describe, it } from 'bun:test';
import {
  createMockTallyArgs,
  executeTallyWasm,
  executeDrWasm,
} from '@seda/dev-tools';
import { readFile } from 'node:fs/promises';
import { callVm, TallyVmAdapter } from '@seda-protocol/vm';

describe('TallyVm', () => {
  it('should run in dr vm mode by default', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );
    const result = await executeDrWasm(
      wasmBinary,
      Buffer.from('testTallyVmMode'),
    );

    expect(result.resultAsString).toEqual('dr');
    expect(result.exitCode).toBe(1);
  });

  it('should run in tally vm mode with the adapter', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );
    const result = await executeTallyWasm(
      wasmBinary,
      Buffer.from('testTallyVmMode'),
      []
    );

    expect(result.resultAsString).toEqual('tally');
    expect(result.exitCode).toBe(0);
  });

  it('should fail to make an http call', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );
    const result = await executeTallyWasm(
      wasmBinary,
      Buffer.from('testTallyVmHttp'),
      []
    );

    expect(result.resultAsString).toEqual('http_fetch is not allowed in tally');
    expect(result.exitCode).toBe(0);
  });

  it('should fail when the reveals and consensus arrays are not the same length', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );

    const args = createMockTallyArgs(Buffer.from('testTallyVmReveals'), [
      {
        exitCode: 0,
        gasUsed: 200000,
        result: JSON.stringify({ data: 'baby_shark' }),
        inConsensus: true,
      },
      {
        exitCode: 1,
        gasUsed: 1336,
        result: JSON.stringify({ data: 'grandpa_shark' }),
        inConsensus: false,
      },
    ]);
    // Override consensus array from the helper.
    args[2] = '[0]';
    const result = await callVm({
      args,
      binary: wasmBinary,
      envs: {},
    }, undefined, new TallyVmAdapter());

    expect(result.exitCode).toBe(255);
    expect(result.stderr).toInclude(
      'abort: Number of reveals (2) does not equal number of consensus reports (1)'
    );
  });

  it('should be able to parse the reveals', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );

    const reports = [
      {
        exitCode: 0,
        gasUsed: 200000,
        result: JSON.stringify({ data: 'baby_shark' }),
        inConsensus: true,
      },
      {
        exitCode: 1,
        gasUsed: 1336,
        result: JSON.stringify({ data: 'grandpa_shark' }),
        inConsensus: true,
      },
    ];

    const result = await executeTallyWasm(wasmBinary, Buffer.from('testTallyVmReveals'), reports);

    expect(result.exitCode).toBe(0);
    expect(result.resultAsString).toBe(
      '[{\"salt\":{\"type\":\"hex\",\"value\":\"736564615f73646b\"},\"exit_code\":0,\"gas_used\":\"200000\",\"reveal\":{\"type\":\"hex\",\"value\":\"7b2264617461223a22626162795f736861726b227d\"},\"in_consensus\":0},{\"salt\":{\"type\":\"hex\",\"value\":\"736564615f73646b\"},\"exit_code\":1,\"gas_used\":\"1336\",\"reveal\":{\"type\":\"hex\",\"value\":\"7b2264617461223a226772616e6470615f736861726b227d\"},\"in_consensus\":0}]'
    );
  });

  it('should provide a convenience method to filter out outliers.', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );

    const reports = [
      {
        exitCode: 1,
        gasUsed: 200000,
        result: JSON.stringify({ data: 'baby_shark' }),
        inConsensus: false,
      },
      {
        exitCode: 0,
        gasUsed: 1336,
        result: JSON.stringify({ data: 'grandpa_shark' }),
        inConsensus: true,
      },
      {
        exitCode: 0,
        gasUsed: 1346,
        result: JSON.stringify({ data: 'cousin_shark' }),

        inConsensus: true,
      },
    ];

    const result = await executeTallyWasm(wasmBinary, Buffer.from('testTallyVmRevealsFiltered'), reports);

    expect(result.exitCode).toBe(0);
    expect(result.resultAsString).toBe(
      '[{\"salt\":{\"type\":\"hex\",\"value\":\"736564615f73646b\"},\"exit_code\":0,\"gas_used\":\"1336\",\"reveal\":{\"type\":\"hex\",\"value\":\"7b2264617461223a226772616e6470615f736861726b227d\"},\"in_consensus\":0},{\"salt\":{\"type\":\"hex\",\"value\":\"736564615f73646b\"},\"exit_code\":0,\"gas_used\":\"1346\",\"reveal\":{\"type\":\"hex\",\"value\":\"7b2264617461223a22636f7573696e5f736861726b227d\"},\"in_consensus\":0}]'
    );
  });
});
