import { Process as WasiProcess, CommandLine } from '../../../node_modules/as-wasi/index';
import { execution_result } from './bindings/env';

export default class Process {
  static args(): string[] {
    return CommandLine.all;
  }

  static exit_with_result(code: u8, result: Uint8Array): void {
    const buffer = result.buffer;
    const bufferPtr = changetype<usize>(buffer);

    execution_result(bufferPtr, buffer.byteLength);
    WasiProcess.exit(u32(code));
  }

  static exit(code: u8): void {
    Process.exit_with_result(code, new Uint8Array(0));
  }
}
