import { Process as WasiProcess, CommandLine } from 'as-wasi/assembly';
import { execution_result } from './bindings/env';

export default class Process {
  /**
   * Gets all the input arguments from the Data Request
   * First argument (index: 0) is the binary hash
   * Second argument (index: 1) is the input of the Data Request
   *
   * @returns {string[]} An array of input arguments
   */
  static args(): string[] {
    return CommandLine.all;
  }

  /**
   * Exits the process with a message
   * This sets the result of the Data Request execution to the message
   *
   * @param {u8} code Exit code (POSIX compatible, 0 is success, >= 1 is error)
   * @param {string} message Message to exit the process with (ex. an error message)
   */
  static exit_with_message(code: u8, message: string): void {
    const msg = String.UTF8.encode(message);
    const buffer = Uint8Array.wrap(msg);

    Process.exit_with_result(code, buffer);
  }

  /**
   * Exits the process with a bytes encoded result
   *
   * @param {u8} code Exit code (POSIX compatible, 0 is success, >= 1 is error)
   * @param {Uint8Array} result Bytes encoded result, which will be sent back to the contract
   */
  static exit_with_result(code: u8, result: Uint8Array): void {
    const buffer = result.buffer;
    const bufferPtr = changetype<usize>(buffer);

    execution_result(bufferPtr, buffer.byteLength);
    WasiProcess.exit(u32(code));
  }

  /**
   * Exits the process
   *
   * @param {u8} code Exit code (POSIX compatible, 0 is success, >= 1 is error)
   */
  static exit(code: u8): void {
    Process.exit_with_result(code, new Uint8Array(0));
  }
}
