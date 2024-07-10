import { expect, describe, it, mock, beforeEach } from 'bun:test';
import { executeDrWasm } from '@seda/dev-tools';
import { readFile } from 'node:fs/promises';
import { Response } from 'node-fetch';

const mockHttpFetch = mock();

function encodeFunctionName(functionName: string) {
  const bytes = Buffer.from(new TextEncoder().encode(functionName));
  return bytes.toString('hex');
}

describe('Http', () => {
  beforeEach(() => {
    mockHttpFetch.mockReset();
  });

  it('Test SDK HTTP Rejection', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );

    const result = await executeDrWasm(
      wasmBinary,
      [encodeFunctionName('testHttpRejection')],
      mockHttpFetch
    );

    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode('rejected'));
  });

  it('Test mocked SDK HTTP Success', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );

    const mockResponse = new Response('mock_ok', { statusText: 'mock_ok' });
    mockHttpFetch.mockResolvedValue(mockResponse);

    const result = await executeDrWasm(
      wasmBinary,
      [encodeFunctionName('testHttpSuccess')],
      mockHttpFetch
    );

    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(new TextEncoder().encode('mock_ok'));
  });

  // Possibly flakey as it relies on internet connectivity and an external service
  it('Test SDK HTTP Success', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );
    const result = await executeDrWasm(wasmBinary, [encodeFunctionName('testHttpSuccess')]);

    expect(result.exitCode).toBe(0);
    expect(result.result).toEqual(
      new TextEncoder().encode(
        JSON.stringify(
          {
            userId: 1,
            id: 1,
            title: 'delectus aut autem',
            completed: false,
          },
          undefined,
          2
        )
      )
    );
  });

  it('should exit when an invalid WASM binary is given', async () => {
    const result = await executeDrWasm(
      Buffer.from(new Uint8Array([0, 97, 115, 109])),
      [encodeFunctionName('testHttpSuccess')]
    );

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
