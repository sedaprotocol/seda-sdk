import { VM_MODE_TALLY, VM_MODE_DR, VM_MODE_ENV_KEY } from './vm-modes';
import { wasi_process } from '@assemblyscript/wasi-shim/assembly/wasi_process';
import { execution_result } from './bindings/seda_v1';
import { decodeHex } from './hex';

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
    return wasi_process.argv;
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
    return wasi_process.env;
  }

  /**
   * Gets the data request / tally inputs
   * 
   * @returns {Uint8Array} bytes encoded inputs
   * @example
   * ```ts
   * const inputs = Process.getInputs();
   * const inputAsString = String.UTF8.decode(inputs.buffer);
   * 
   * console.log(inputAsString);
   * ```
   */
  static getInputs(): Uint8Array {
    // Data at index 0 is the dr/tally inputs encoded as hex
    const data = Process.args().at(1);

    return decodeHex(data);
  }

  /**
   * Gets the mode of the VM instance.
   *
   * @returns {string} The mode of the VM, either 'dr' or 'tally'.
   */
  static getVmMode(): string {
    const env = Process.envs();

    return env.get(VM_MODE_ENV_KEY);
  }

  /**
   * Returns true when the VM instance is in 'tally' mode.
   *
   * @returns {boolean}
   */
  static isTallyVmMode(): boolean {
    return Process.getVmMode() === VM_MODE_TALLY;
  }

  /**
   * Returns true when the VM instance is in 'dr' mode.
   *
   * @returns {boolean}
   */
  static isDrVmMode(): boolean {
    return Process.getVmMode() === VM_MODE_DR;
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
    wasi_process.exit(u32(code));
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
