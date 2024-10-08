import {
	lazyArgv,
	lazyEnv,
	wasi_process,
} from "@assemblyscript/wasi-shim/assembly/wasi_process";
import { execution_result } from "./bindings/seda_v1";
import { Bytes } from "./bytes";
import { VM_MODE_DR, VM_MODE_ENV_KEY, VM_MODE_TALLY } from "./vm-modes";

const POSIX_SUCCESS_CODE = u8(0);
const POSIX_ERROR_CODE = u8(1);

const argv = lazyArgv();
const env = lazyEnv();

/**
 * A set of methods to interact with the process in which the Oracle Program is running.
 *
 * @category Program
 */
export default class Process {
	/** @hidden */
	private constructor() {}

	/**
	 * Gets all the input arguments from the Data Request
	 * First argument (index: 0) is the Oracle Program ID
	 * Second argument (index: 1) is the input of the Data Request
	 *
	 * @returns {string[]} An array of input arguments
	 * @example
	 * ```ts
	 * const args = Process.args();
	 * ```
	 */
	static args(): string[] {
		return argv;
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
		return env;
	}

	/**
	 * Gets the data request / tally inputs
	 *
	 * @returns {Bytes} bytes encoded inputs
	 * @example
	 * ```ts
	 * const inputs = Process.getInputs();
	 * const inputAsString = inputs.toUtf8String();
	 *
	 * console.log(inputAsString);
	 * ```
	 */
	static getInputs(): Bytes {
		// Data at index 1 is the dr/tally inputs encoded as hex
		const data = Process.args().at(1);

		return Bytes.fromHexString(data);
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
	 * Process.success(Bytes.fromUtf8String(result));
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
	 * Process.error(Bytes.fromUtf8String(error));
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
