import { toString } from "./string-utils";

/**
 * A wrapper around the built-in `console` object. Supports logging strings, as well as objects,
 * arrays, and typed arrays.
 *
 * @category Program
 * @example
 * ```ts
	Console.log("test"); // "test"

	const bytes = Bytes.fromUtf8String("hello seda");
	Console.log(bytes); // '{"type":"hex","value":"68656c6c6f2073656461"}'

	const typedArray = new Uint8Array(5);
	Console.log(typedArray); // "TypedArray(0000000000)"

	@json
	class Response {
		value!: string;
	}

	const response = JSON.parse<Response>('{"value":"5""}');
	Console.log(response); // '{"value":"5"}'
 * ```
 */
export class Console {
	/**
	 * @hidden Not meant to be instantiated
	 */
	private constructor() {}

	static log<T = string>(message: T): void {
		console.log(toString(message));
	}

	static warn<T = string>(message: T): void {
		console.warn(toString(message));
	}

	static debug<T = string>(message: T): void {
		console.debug(toString(message));
	}

	static error<T = string>(message: T): void {
		console.error(toString(message));
	}

	static info<T = string>(message: T): void {
		console.info(toString(message));
	}
}
