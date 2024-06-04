import { Process as WasiProcess, CommandLine, Environ } from 'as-wasi/assembly';
import { execution_result } from './bindings/seda_v1';

export default class Process {
  /**
   * Gets all the input arguments from the Data Request
   * First argument (index: 0) is the binary hash
   * Second argument (index: 1) is the input of the Data Request
   *
   * @returns {string[]} An array of input arguments
   * @example
   * ```ts
   * const args = Process.args();
   * ```
   */
  static args(): string[] {
    return CommandLine.all;
  }

  /**
   * Gets all the environment variables as a Map
   *
   * @returns {Map<string, string>} key, value pair with all environment variables
   * @example
   * ```ts
   * const env = Process.env();
   *
   * const vmMode = env.get('VM_MODE');
   * ```
   */
  static envs(): Map<string, string> {
    const result: Map<string, string> = new Map();

    for (let i: i32 = 0; i < Environ.all.length; i++) {
      const entry = Environ.all[i];
      result.set(entry.key, entry.value);
    }

    return result;
  }

  /**
   * Exits the process with a message
   * This sets the result of the Data Request execution to the message
   *
   * @param {u8} code Exit code (POSIX compatible, 0 is success, >= 1 is error)
   * @param {string} message Message to exit the process with (ex. an error message)
   * @example
   * ```ts
   * const result = true;
   *
   * if (result) {
   *   Process.exit_with_message(0, "result was true");
   * } else {
   *   Process.exit_with_message(1, "result errored");
   * }
   * ```
   */
  static exit_with_message(code: u8, message: string): void {
    const msg = String.UTF8.encode(message);
    const buffer = Uint8Array.wrap(msg);

    Process.exit_with_result(code, buffer);
  }

  /**
   * Exits the process with a bytes encoded result.
   * This sets Data Request execution result to the bytes
   *
   * @param {u8} code Exit code (POSIX compatible, 0 is success, >= 1 is error)
   * @param {Uint8Array} result Bytes encoded result, which will be sent back to the contract
   * @example
   * ```ts
   * const result = String.UTF8.encode("{\"price\": \"10.23\"}");
   * const resultBuffer = Uint8Array.wrap(msg);
   *
   * Process.exit_with_result(0, resultBuffer);
   * ```
   */
  static exit_with_result(code: u8, result: Uint8Array): void {
    const buffer = result.buffer;
    const bufferPtr = changetype<usize>(buffer);

    execution_result(bufferPtr, buffer.byteLength);
    WasiProcess.exit(u32(code));
  }

  /**
   * Exits the process (no result set)
   *
   * @param {u8} code Exit code (POSIX compatible, 0 is success, >= 1 is error)
   * @example
   * ```
   * Process.exit(0);
   * ```
   */
  static exit(code: u8): void {
    Process.exit_with_result(code, new Uint8Array(0));
  }
}
