/**
 * Encodes a byte array as a hexidecimal string without '0x' prefix.
 * @param array The byte array to encode.
 * @returns Hex encoded representation of the byte array without '0x' prefix.
 */
export function encodeHex(array: Uint8Array): string {
	let hex = "";

	for (let i = 0; i < array.length; i++) {
		hex += array[i].toString(16).padStart(2, "0");
	}

	return hex;
}

/**
 * Decodes a hexidecimal string to raw bytes. Ignores any '0x' prefix.
 * @param input The string to decode as hex.
 * @returns The decoded byte array.
 */
export function decodeHex(input: string): Uint8Array {
	const data = input.replace("0x", "");
	const array = new Uint8Array(data.length >>> 1);

	for (let i = 0; i < data.length >>> 1; ++i) {
		array.fill(
			i32(Number.parseInt(`0x${data.substr(i * 2, 2)}`, 16)),
			i,
			i + 1,
		);
	}

	return array;
}
