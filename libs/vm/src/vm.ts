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
  resultAsString?: string;
}

export async function executeVm(callData: VmCallData, notifierBuffer: SharedArrayBuffer): Promise<VmResult> {
  await init();
  const wasi = new WASI({
    args: callData.args,
    env: callData.envs,
  });

  try {
    const binary = new Uint8Array(callData.binary);
    const module = await WebAssembly.compile(binary);

    const wasiImports = wasi.getImports(module);
    const vmImports = new VmImports(notifierBuffer);
    const finalImports = vmImports.getImports(wasiImports);

    const instance = await WebAssembly.instantiate(module, finalImports);
    const memory = instance.exports.memory;
    vmImports.setMemory(memory as WebAssembly.Memory);

    const exitCode = wasi.start(instance);

    return {
      exitCode,
      stderr: wasi.getStderrString(),
      stdout: wasi.getStdoutString(),
      result: vmImports.result,
      resultAsString: new TextDecoder().decode(vmImports.result),
    }
  } catch (err) {
    console.error(`
      @executeWasm
      Execption threw: ${err}
      VM StdErr: ${wasi.getStderrString()}
      VM StdOut: ${wasi.getStdoutString()}
    `);

    const stderr = wasi.getStderrString();

    return {
      exitCode: 1,
      stderr: stderr !== '' ? stderr : (err + ''),
      stdout: wasi.getStdoutString(),
      result: new Uint8Array(),
      resultAsString: '',
    };
  }
}
