import { callVm } from '../../../dist/libs/vm';
import { jest } from '@jest/globals';
import { readFile } from 'node:fs/promises';
import { HttpFetchResponse } from '../../../dist/libs/vm/src/types/vm-actions';
import { PromiseStatus } from '../../../dist/libs/vm/src/types/vm-promise';

const mockHttpFetch = jest.fn();

jest.setTimeout(15_000);

const TestVmAdapter = jest.fn().mockImplementation(() => {
  return {
    setProcessId: () => {},
    httpFetch: mockHttpFetch
  };
});

describe('Http', () => {
  beforeEach(() => {
    mockHttpFetch.mockReset();
  });


  it('Test SDK HTTP Rejection', async () => {
    const wasmBinary = await readFile('dist/libs/as-sdk-integration-tests/debug.wasm');
    const result = await callVm({
      args: ['testHttpRejection'],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    });

    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode("rejected"));
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

    const result = await callVm({
      args: ['testHttpSuccess'],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    }, undefined, new TestVmAdapter());

    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode('ok'));
  });




  it('Test SDK HTTP Success', async () => {
    const wasmBinary = await readFile('dist/libs/as-sdk-integration-tests/debug.wasm');
    const result = await callVm({
      args: ['testHttpSuccess'],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    });

    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode("ok"));
  });


  it("should exit when an invalid WASM binary is given", async ()  => {
    const result = await callVm({
      args: ['testHttpSuccess'],
      envs: {},
      binary: new Uint8Array([0, 97, 115, 109]),
    });

    expect(result).toEqual({ exitCode: 1, stderr: 'CompileError: WebAssembly.compile(): expected 4 bytes, fell off end @+4', stdout: '', result: new Uint8Array(), resultAsString: '' });
  });

});
