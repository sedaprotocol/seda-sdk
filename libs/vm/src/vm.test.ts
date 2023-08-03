// TODO: We could take a look to also to do it through swc
import { callVm } from "../../../dist/libs/vm";
import { readFile } from 'node:fs/promises';

describe("vm", () => {
  it("should be able to execute a data request", async ()  => {
    const wasmBinary = await readFile('res/simple-dr.wasm');
    const result = await callVm({
      args: ['test'],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    });

    expect(result).toEqual({ exitCode: 0, stderr: '', stdout: 'hello world\n', result: {} });
  });

  it("should be able to execute a hello world program", async ()  => {
    const wasmBinary = await readFile('res/demo.wasm');
    const result = await callVm({
      args: [],
      envs: {},
      binary: new Uint8Array(wasmBinary),
    });

    expect(result).toEqual({ exitCode: 0, stderr: '', stdout: 'hello world\n', result: {} });
  });

  it("should exit when an invalid WASM binary is given", async ()  => {
    const result = await callVm({
      args: [],
      envs: {},
      binary: new Uint8Array([0, 97, 115, 109]),
    });

    expect(result).toEqual({ exitCode: 1, stderr: 'CompileError: WebAssembly.compile(): expected 4 bytes, fell off end @+4', stdout: '', result: {} });
  });
});
