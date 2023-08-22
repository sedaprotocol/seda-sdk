import { readFile } from "fs/promises";
import { callVm } from "../../../dist/libs/vm/src";

describe('json-utils', () => {
  it('should handle valid u8 json arrays', async () => {
     const wasmBinary = await readFile(
       'dist/libs/as-sdk-integration-tests/debug.wasm'
     );
     const result = await callVm({
       args: ['testValidUint8JsonArray'],
       envs: {},
       binary: new Uint8Array(wasmBinary),
     });

     expect(result.resultAsString).toEqual('ok');
     expect(result.exitCode).toBe(0);
  });

  it('should error on invalid u8 json arrays', async () => {
    const wasmBinary = await readFile(
      'dist/libs/as-sdk-integration-tests/debug.wasm'
    );
    const result = await callVm({
      args: ['testInvalidUint8JsonArray'],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    });

    expect(result.stderr).toContain('abort: Invalid u8 299');
    expect(result.exitCode).toBe(255);
  });
});
