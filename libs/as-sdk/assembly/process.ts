import {
  args_get,
  args_sizes_get,
  environ_get,
  environ_sizes_get,
} from "@assemblyscript/wasi-shim/assembly/bindings/wasi_snapshot_preview1";
import { VM_MODE_TALLY, VM_MODE_DR, VM_MODE_ENV_KEY } from "./vm-modes";
import { Process as WasiProcess, CommandLine, Environ } from "as-wasi/assembly";
import { execution_result } from "./bindings/seda_v1";

const tempbuf = memory.data(4 * sizeof<usize>());

function errnoToString(errno: u16): string {
  return errno.toString();
}

function lazyArgv(): string[] {
  let err = args_sizes_get(tempbuf, tempbuf + sizeof<usize>());
  if (err) throw new Error(errnoToString(err));
  let count = load<usize>(tempbuf);
  let ptrsSize = count * sizeof<usize>();
  let dataSize = load<usize>(tempbuf, sizeof<usize>());
  let bufSize = ptrsSize + dataSize;
  let buf = __alloc(bufSize);
  err = args_get(buf, buf + ptrsSize);
  if (err) throw new Error(errnoToString(err));
  let count32 = <i32>count;
  let argv = new Array<string>(count32);
  for (let i = 0; i < count32; ++i) {
    let ptr = load<usize>(buf + i * sizeof<usize>());
    let str = String.UTF8.decodeUnsafe(ptr, ptr + bufSize - buf, true);
    argv[i] = str;
  }
  __free(buf);
  return argv;
}

function lazyEnv(): Map<string, string> {
  let err = environ_sizes_get(tempbuf, tempbuf + 4);
  if (err) throw new Error(errnoToString(err));
  let count = load<usize>(tempbuf);
  let ptrsSize = count * sizeof<usize>();
  let dataSize = load<usize>(tempbuf, sizeof<usize>());
  let bufSize = ptrsSize + dataSize;
  let buf = __alloc(bufSize);
  err = environ_get(buf, buf + ptrsSize);
  if (err) throw new Error(errnoToString(err));
  let env = new Map<string, string>();
  for (let i: usize = 0; i < count; ++i) {
    let ptr = load<usize>(buf + i * sizeof<usize>());
    let str = String.UTF8.decodeUnsafe(ptr, ptr + bufSize - buf, true);
    let pos = str.indexOf("=");
    if (~pos) {
      env.set(str.substring(0, pos), str.substring(pos + 1));
      // __dispose(changetype<usize>(str));
    } else {
      env.set(str, "");
    }
  }
  __free(buf);
  return env;
}

@lazy export const argv = lazyArgv();
  // @ts-ignore: decorator
@lazy export const env = lazyEnv();

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
    // return CommandLine.all;
    return argv;
  }

  /**
   * Gets all the environment variables as a Map
   *
   * @returns {Map<string, string>} key, value pair with all environment variables
   * @example
   * ```ts
   * const env = Process.envs();
   *
   * const vmMode = env.get('VM_MODE');
   * ```
   */
  static envs(): Map<string, string> {
    // const result: Map<string, string> = new Map();
    // const envs = Environ.all;

    // for (let index = 0; index < envs.length; index++) {
    //   const element = envs[index];
    //   console.log(element.key + "=" + element.value);
    //   result.set(element.key, element.value);
    // }

    // for (let i: i32 = 0; i < Environ.all.length; i++) {
    //   const entry = Environ.all[i];
    //   result.set(entry.key, entry.value);
    // }

    // return result;
    return env;
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
