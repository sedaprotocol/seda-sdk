import { encodeHex } from "./hex";

export interface ToString {
	toString(): string;
}

/**
 * Converts an generic type to a string
 * Takes into account the @json decorator or if defined the toString() method
 *
 * @param message
 * @returns
 */
export function toString<T = string>(message: T): string {
	if (!isFloat(message) && message === null) {
		return "null";
	}

	if (message instanceof ArrayBuffer) {
		return `ArrayBuffer(0x${encodeHex(Uint8Array.wrap(message))})`;
	}

	// @ts-expect-error We're testing for the method before calling it
	if (isDefined(message.buffer) && message.buffer instanceof ArrayBuffer) {
		// @ts-expect-error We're testing for the method before calling it
		return `TypedArray(0x${encodeHex(Uint8Array.wrap(message.buffer))})`;
	}

	// @ts-expect-error We're testing for the method before calling it
	if (isString<T>() || isDefined(message.toString)) {
		// @ts-expect-error We're testing for the method before calling it
		return message.toString();
	}

	// @ts-expect-error We're testing for the method before calling it
	if (isDefined(message.__SERIALIZE)) {
		// @ts-expect-error We're testing for the method before calling it
		return message.__SERIALIZE();
	}

	return "[Object object]";
}
