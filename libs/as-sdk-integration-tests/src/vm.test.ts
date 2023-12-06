// TODO: We could take a look to also to do it through swc
import { callVm } from "../../../dist/libs/vm/src";
import { jest } from '@jest/globals';
import { readFile } from 'node:fs/promises';
import { HttpFetchResponse } from '../../../dist/libs/vm/src/types/vm-actions';
import { PromiseStatus } from "../../../dist/libs/vm/src/types/vm-promise";
import { debug } from "node:console";

const mockHttpFetch = jest.fn();

jest.setTimeout(10_000);

const TestVmAdapter = jest.fn().mockImplementation(() => {
  return {
    setProcessId: () => {},
    httpFetch: mockHttpFetch
  };
});

describe("vm", () => {
  beforeEach(() => {
    mockHttpFetch.mockReset();
  });

  it("should be able to write the execution result", async ()  => {
    // const wasmBinary = await readFile('res/simple-dr.wasm');
    const wasmBinary = await readFile('dist/libs/as-sdk-integration-tests/debug.wasm');

    const result = await callVm({
      args: [],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    });

    
    expect(result.result).toEqual(new TextEncoder().encode('ok'));
  });

  it("should be able to execute a hello world program", async ()  => {
    // const wasmBinary = await readFile('res/demo.wasm');
    const wasmBinary = await readFile('dist/libs/as-sdk-integration-tests/debug.wasm');

    const result = await callVm({
      args: [],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    });

    expect(result).toEqual({ exitCode: 0, stderr: '', stdout: 'hello world\n', result: new Uint8Array(), resultAsString: '' });
  });

  it("should exit when an invalid WASM binary is given", async ()  => {
    const result = await callVm({
      args: [],
      envs: {},
      binary: new Uint8Array([0, 97, 115, 109]),
    });

    expect(result).toEqual({ exitCode: 1, stderr: 'CompileError: WebAssembly.compile(): expected 4 bytes, fell off end @+4', stdout: '', result: new Uint8Array(), resultAsString: '' });
  });

  it('should be able to call the given adapter', async () => {
    // const wasmBinary = await readFile('res/simple-dr.wasm');
    const wasmBinary = await readFile('dist/libs/as-sdk-integration-tests/debug.wasm');


    const mockResponse = new HttpFetchResponse({
      content_length: 1,
      bytes: [1],
      headers: {},
      status: 200,
      url: "http://example.com",
    });

    mockHttpFetch.mockResolvedValue(PromiseStatus.fulfilled(mockResponse));

    const result = await callVm(
      {
        args: [],
        envs: {},
        binary: new Uint8Array(wasmBinary),
      },
      undefined,
      new TestVmAdapter
    );

    expect(mockHttpFetch).toHaveBeenCalledTimes(1);
    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode('ok'));
  });

  it('should be able to continue execution even when an http fetch failed', async () => {
    // const wasmBinary = await readFile('res/simple-dr.wasm');
    const wasmBinary = await readFile('dist/libs/as-sdk-integration-tests/debug.wasm');


    const mockResponse = new HttpFetchResponse({
      content_length: 1,
      bytes: [1],
      headers: {},
      status: 200,
      url: 'http://example.com',
    });

    mockHttpFetch.mockRejectedValue(PromiseStatus.rejected(mockResponse));

    const result = await callVm(
      {
        args: [],
        envs: {},
        binary: new Uint8Array(wasmBinary),
      },
      undefined,
      new TestVmAdapter()
    );

    expect(mockHttpFetch).toHaveBeenCalledTimes(1);
    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode('ok'));
  });

  it('should correctly write the response (call_result_write)', async () => {
    // const wasmBinary = await readFile('res/simple-dr.wasm');
    const wasmBinary = await readFile('dist/libs/as-sdk-integration-tests/debug.wasm');


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
        args: [],
        envs: {},
        binary: new Uint8Array(wasmBinary),
      },
      undefined,
      new TestVmAdapter()
    );

    expect(result.stdout).toBe(
      `We've done it HttpFetchResponse { status: 200, headers: {}, bytes: [1], url: "http://example.com", content_length: 1 } "\\u{1}"\n`
    );
  });
});
