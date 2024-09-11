import { JSON } from "json-as";
import { decodeHex, encodeHex } from "./hex";

@json
class InnerBytes {
	type: string = "hex";
	value!: string;
}

export class Bytes {
	type: string = "hex";
	value: Uint8Array;

	private constructor(value: Uint8Array) {
		this.value = value;
	}

	__SERIALIZE(): string {
		const inner = new InnerBytes();
		inner.value = encodeHex(this.value);

		return JSON.stringify(inner);
	}

	__INITIALIZE(): void {}

	__DESERIALIZE(
		data: string,
		_key_start: i32,
		_key_end: i32,
		_outerLoopIndex: i32,
		_numberValueIndex: i32,
	): bool {
		const innerBytes = JSON.parse<InnerBytes>(data);
		const buffer = decodeHex(innerBytes.value);
		this.value = buffer;

		return true;
	}

	buffer(): ArrayBuffer {
		return this.value.buffer;
	}

	toUtf8String(): string {
		return String.UTF8.decode(this.value.buffer);
	}

	static fromUtf8String(payload: string): Bytes {
		const data = String.UTF8.encode(payload);
		return new Bytes(Uint8Array.wrap(data));
	}

	toByteArray(): Uint8Array {
		return this.value;
	}

	static fromByteArray(payload: Uint8Array): Bytes {
		return new Bytes(payload);
	}

	/**
	 * Encodes the bytes as a hexidecimal string without '0x' prefix.
	 */
	toHexString(): string {
		return encodeHex(this.value);
	}

	/**
	 * Decodes a hexidecimal string to Bytes. Ignores any '0x' prefix.
	 */
	static fromHexString(payload: string): Bytes {
		const data = decodeHex(payload);
		return new Bytes(data);
	}

	static empty(): Bytes {
		return new Bytes(new Uint8Array(0));
	}

	slice(begin: i32 = 0, end: i32 = i32.MAX_VALUE): Bytes {
		const byteSlice = this.value.slice(begin, end);
		return new Bytes(byteSlice);
	}
}
