import { callVm,  } from '../../../dist/libs/vm';
import { jest } from '@jest/globals';
import { readFile } from 'node:fs/promises';
import { HttpFetchResponse } from '../../../dist/libs/vm/src/types/vm-actions';
import { PromiseStatus } from '../../../dist/libs/vm/src/types/vm-promise';

const mockHttpFetch = jest.fn();

const TestVmAdapter = jest.fn().mockImplementation(() => {
  return { httpFetch: mockHttpFetch };
});

describe('Http', () => {
  it('Test SDK HTTP Rejection', async () => {

    const wasmBinary = await readFile('dist/libs/as-sdk-integration-tests/debug.wasm');
    const result = await callVm({
      args: ['testHttpRejection'],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    });

    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode("ok"));
  });

  it('Test SDK HTTP Success', async () => {
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

    const result = await callVm({
      args: ['testHttpSuccess'],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    }, undefined, new TestVmAdapter());

    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode('ok'));
  });
});
