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
	if (isArray<T>()) {
		if (Array.isArray(message)) {
			let result = "[";

			for (let index = 0; index < message.length; index++) {
				const element = message[index];
				result += `${toString(element)}`;

				if (index !== message.length - 1) {
					result += ", ";
				}
			}

			return result + "]";
		}

		return "Array<T>";
	}

	if (isNullable<T>()) {
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
