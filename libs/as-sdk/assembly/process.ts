import { VM_MODE_TALLY, VM_MODE_DR, VM_MODE_ENV_KEY } from './vm-modes';
import { wasi_process } from '@assemblyscript/wasi-shim/assembly/wasi_process';
import { execution_result } from './bindings/seda_v1';
import { decodeHex } from './hex';
import { Bytes } from './bytes';

const POSIX_SUCCESS_CODE = u8(0);
const POSIX_ERROR_CODE = u8(1);

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
   * @returns {Bytes} bytes encoded inputs
   * @example
   * ```ts
   * const inputs = Process.getInputs();
   * const inputAsString = String.UTF8.decode(inputs.buffer);
   *
   * console.log(inputAsString);
   * ```
   */
  static getInputs(): Bytes {
    // Data at index 0 is the dr/tally inputs encoded as hex
    const data = Process.args().at(1);

    return Bytes.fromBytes(decodeHex(data));
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
   * Exits the process (no result set)
   *
   * @param {u8} code Exit code (POSIX compatible, 0 is success, >= 1 is error)
   * @example
   * ```
   * Process.exit(0);
   * ```
   */
  static exit(code: u8): void {
    exitWithResult(code, Bytes.empty());
  }

  /**
   * Exits the process with a bytes encoded result.
   * This sets Data Request execution result to the bytes
   *
   * @param {Bytes} result Bytes encoded result, which will be sent back to the contract
   * @example
   * ```ts
   * const result = "{\"price\": \"10.23\"}";
   *
   * Process.success(Bytes.fromString(result));
   * ```
   */
  static success(result: Bytes): void {
    exitWithResult(POSIX_SUCCESS_CODE, result);
  }

  /**
   * Exits the process with a bytes encoded result.
   * This sets Data Request execution result to the bytes
   *
   * @param {Bytes} result Bytes encoded result, which will be sent back to the contract
   * @param {u8} [code=1] code Exit code, defaults to 1 (POSIX compatible, 0 is success, >= 1 is error)
   * @example
   * ```ts
   * const error = "Failed to fetch data from https://example.com";
   *
   * Process.error(Bytes.fromString(error));
   * ```
   */
    static error(result: Bytes, code: u8 = POSIX_ERROR_CODE): void {
      exitWithResult(code, result);
    }
}

function exitWithResult(code: u8, result: Bytes): void {
  const buffer = result.value.buffer;
  const bufferPtr = changetype<usize>(buffer);

  execution_result(bufferPtr, buffer.byteLength);
  wasi_process.exit(u32(code));
}
