import { init, WASI } from '@wasmer/wasi';
import VmImports from './vm-imports.js';

export interface VmCallData {
  binary: Uint8Array | number[];
  args: string[];
  envs: Record<string, string>;
}

export interface VmResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  result?: Uint8Array;
}

export async function executeVm(callData: VmCallData): Promise<VmResult> {
  try {
    await init();

    const binary = new Uint8Array(callData.binary);
    const module = await WebAssembly.compile(binary);
    const wasi = new WASI({
      args: callData.args,
      env: callData.envs,
    });

    const wasiImports = wasi.getImports(module);
    const vmImports = new VmImports();
    const finalImports = vmImports.getImports(wasiImports);

    const instance = await WebAssembly.instantiate(module, finalImports);
    const memory = instance.exports.memory;
    vmImports.setMemory(memory as WebAssembly.Memory);

    const exitCode = wasi.start(instance);

    return {
      exitCode,
      stderr: wasi.getStderrString(),
      stdout: wasi.getStdoutString(),
      result: new Uint8Array(),
    }
  } catch (err) {
    return {
      exitCode: 1,
      stderr: `${err}`,
      stdout: "",
      result: new Uint8Array(),
    }
  }
}
