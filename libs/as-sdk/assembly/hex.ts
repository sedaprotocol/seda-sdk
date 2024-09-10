export function encodeHex(array: Uint8Array): string {
	let hex = "";

	for (let i = 0; i < array.length; i++) {
		hex += array[i].toString(16).padStart(2, "0");
	}

	return hex;
}

export function decodeHex(data: string): Uint8Array {
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
