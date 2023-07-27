import { init, WASI } from '@wasmer/wasi';

export interface VmCallData {
  binary: number[];
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
  await init();

  const binary = new Uint8Array(callData.binary);
  const module = await WebAssembly.compile(binary);
  const wasi = new WASI({
    args: callData.args,
    env: callData.envs,
  });

  wasi.instantiate(module, {});

  const exitCode = wasi.start();

  return {
    exitCode,
    stderr: wasi.getStderrString(),
    stdout: wasi.getStdoutString(),
    result: new Uint8Array(),
  }
}
