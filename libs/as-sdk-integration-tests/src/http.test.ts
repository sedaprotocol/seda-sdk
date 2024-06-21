import { expect, describe, it, mock, beforeEach } from 'bun:test';
import { callVm } from '../../../dist/libs/vm/src/index.js';
import { readFile } from 'node:fs/promises';
import { HttpFetchResponse } from '../../../dist/libs/vm/src/types/vm-actions.js';
import { PromiseStatus } from '../../../dist/libs/vm/src/types/vm-promise.js';

const mockHttpFetch = mock();

const TestVmAdapter = mock().mockImplementation(() => {
  return {
    modifyVmCallData: (v) => v,
    setProcessId: () => {},
    httpFetch: mockHttpFetch,
  };
});

describe('Http', () => {
  beforeEach(() => {
    mockHttpFetch.mockReset();
  });

  it('Test SDK HTTP Rejection', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );
    const result = await callVm({
      args: ['testHttpRejection'],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    });

    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode('rejected'));
  });

  it('Test mocked SDK HTTP Success', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );

    const mockResponse = new HttpFetchResponse({
      content_length: 1,
      bytes: [1],
      headers: {},
      status: 200,
      url: 'http://example.com',
    });

    mockHttpFetch.mockResolvedValue(PromiseStatus.fulfilled(mockResponse));

    const result = await callVm(
      {
        args: ['testHttpSuccess'],
        envs: {},
        binary: new Uint8Array(wasmBinary),
      },
      undefined,
      TestVmAdapter()
    );

    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode('ok'));
  });

  it('Test SDK HTTP Success', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );
    const result = await callVm({
      args: ['testHttpSuccess'],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    });

    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode('ok'));
  });

  it('should exit when an invalid WASM binary is given', async () => {
    const result = await callVm({
      args: ['testHttpSuccess'],
      envs: {},
      binary: new Uint8Array([0, 97, 115, 109]),
    });

    expect(result).toEqual({
      exitCode: 1,
      stderr:
        "CompileError: WebAssembly.Module doesn't parse at byte 0: expected a module of at least 8 bytes",
      stdout: '',
      result: new Uint8Array(),
      resultAsString: '',
    });
  });
});
