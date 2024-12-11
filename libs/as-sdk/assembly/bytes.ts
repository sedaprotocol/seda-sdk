import { u128, u256 } from "as-bignum/assembly";
import { JSON } from "json-as";
import { decodeHex, encodeHex } from "./hex";
import { Console } from "./console";

@json
class InnerBytes {
	type: string = "hex";
	value!: string;
}

/**
 * A class to make dealing with bytes easier. Allows to quickly convert between UTF-8,
 * hexadecimal, and byte array representations of data.
 *
 * @category Bytes
 * @example
 * ```ts
	const input = Bytes.fromHexString("6574682d75736463");

	const pairsString = input.toUtf8String();

	Console.log(pairsString); // eth-usdc
 * ```
 */
export class Bytes {
	/**
	 * @hidden Just used as a hint when logging Bytes.
	 */
	type: string = "hex";
	/**
	 * The underlying byte array. Can also be accessed through {@linkcode toByteArray}.
	 */
	value: Uint8Array;

	/**
	 * @hidden Should only be constructed through static methods.
	 */
	private constructor(value: Uint8Array) {
		this.value = value;
	}

	/**
	 * @hidden Required for JSON-AS (de)serialization.
	 */
	__SERIALIZE(): string {
		const inner = new InnerBytes();
		inner.value = encodeHex(this.value);

		return JSON.stringify(inner);
	}

	/**
	 * @hidden Required for JSON-AS (de)serialization.
	 */
	__INITIALIZE(): void {}

	/**
	 * @hidden Required for JSON-AS (de)serialization.
	 */
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

	/**
	 * @hidden Required for JSON-AS (de)serialization.
	 */
	__DESERIALIZE_SAFE(
		data: string,
		_key_start: i32,
		_key_end: i32,
		_outerLoopIndex: i32,
		_numberValueIndex: i32,
	): bool {
		const innerBytes = JSON.parseSafe<InnerBytes>(data);
		const buffer = decodeHex(innerBytes.value);
		this.value = buffer;

		return true;
	}

	/**
	 * The underlying {@link ArrayBuffer} in case you need to manipulate it directly.
	 * Most likely {@linkcode toUtf8String} or {@linkcode toHexString} is the better choice.
	 *
	 * @example
	 * ```ts
		const input = Bytes.fromHexString("6574682d75736463");

		Console.log(String.UTF8.decode(input.buffer);); // eth-usdc
	 * ```
	 */
	get buffer(): ArrayBuffer {
		return this.value.buffer;
	}

	/**
	 * Decode this Bytes instance as a UTF-8 string.
	 *
	 * @example
	 * ```ts
		const input = Bytes.fromHexString("6574682d75736463");
		const pairsString = input.toUtf8String();

		const pairsList = pairsString.split("-");
		const a = pairsList[0];
		const b = pairsList[1];

		Console.log(a); // eth
		Console.log(b); // usdc
	 * ```
	 */
	toUtf8String(): string {
		return String.UTF8.decode(this.value.buffer);
	}

	/**
	 * Encode a given string as UTF-8 bytes.
	 *
	 * @example
	 * ```ts
		const output = Bytes.fromUtf8String("winner");

		// Exit the program with the UTF-8 encoded bytes as the output.
		Process.success(output);
	 * ```
	 */
	static fromUtf8String(payload: string): Bytes {
		const data = String.UTF8.encode(payload);
		return new Bytes(Uint8Array.wrap(data));
	}

	/**
	 * The underlying byte array in case you need to use it directly.
	 * Can also be accessed through {@linkcode value}.
	 *
	 * @example
	 * ```ts
		const data = Bytes.fromHexString("6574682d75736463");

		const byteArray = data.toByteArray();
		Console.log(byteArray.length); // 8
	 * ```
	 */
	toByteArray(): Uint8Array {
		return this.value;
	}

	/**
	 * Wrap an existing byte array in Bytes.
	 *
	 * @example
	 * ```ts
		import { decode } from "as-base64";

		const data = decode("aGVsbG8gc2VkYQ==");
		Console.log(data.toUtf8String()); // "hello seda"
	 * ```
	 */
	static fromByteArray(payload: Uint8Array): Bytes {
		return new Bytes(payload);
	}

	/**
	 * Encode the bytes as a hexidecimal string without '0x' prefix.
	 *
	 * @example
	 * ```ts
		const data = Bytes.fromUtf8String("eth-usdc");

		const dataAsHex = data.toHexString();
		Console.log(dataAsHex); // "6574682d75736463"
	 * ```
	 */
	toHexString(): string {
		return encodeHex(this.value);
	}

	/**
	 * Decode a hexidecimal string to Bytes. Ignores any '0x' prefix.
	 *
	 * @example
	 * ```ts
		const data = Bytes.fromHexString("6574682d75736463");
		// Equivalent to
		const dataWithPrefix = Bytes.fromHexString("0x6574682d75736463");

		Console.log(data.toUtf8String); // "eth-usdc"
		Console.log(dataWithPrefix.toUtf8String); // "eth-usdc"
	 * ```
	 */
	static fromHexString(payload: string): Bytes {
		const data = decodeHex(payload);
		return new Bytes(data);
	}

	/**
	 * Create an empty bytes instance.
	 */
	static empty(): Bytes {
		return new Bytes(new Uint8Array(0));
	}

	/**
	 * The length of the underlying byte array.
	 *
	 * @example
	 * ```ts
		const data = Bytes.fromHexString("6574682d75736463");

		Console.log(data.length); // 8
	 * ```
	 */
	get length(): i32 {
		return this.value.length;
	}

	/**
	 * Create a new Bytes instance from a slice of the original instance.
	 *
	 * @example
	 * ```ts
		const data = Bytes.fromHexString("68656c6c6f2073656461");

		// Without begin and end it returns a new copy
		const copy = data.slice();
		Console.log(copy.toUtf8String()); // "hello seda"

		// Without end it starts the slice at begin and copies until the end
		const noEnd = data.slice(6);
		Console.log(noEnd.toUtf8String()); // "seda"

		// Without begin and end it returns a new copy
		const beginAndEnd = data.slice(1, 5);
		Console.log(beginAndEnd.toUtf8String()); // "ello"
	 * ```
	 * @param begin Inclusive beginning of the slice to copy
	 * @param end Exclusive end of the slice to copy
	 */
	slice(begin: i32 = 0, end: i32 = i32.MAX_VALUE): Bytes {
		const byteSlice = this.value.slice(begin, end);
		return new Bytes(byteSlice);
	}

	/**
	 * Create a new Bytes instance which is a combination of the first instance and the argument.
	 *
	 * @example
	 * ```ts
		const part1 = Bytes.fromUtf8String("Hello, ");
		const part2 = Bytes.fromUtf8String("world!");

		const combined = part1.concat(part2);

		Console.log(combined.toUtf8String()); // "Hello, world!"
	 * ```
	 * @param bytes the bytes to add to this instance
	 */
	concat(bytes: Bytes): Bytes {
		return Bytes.concat([this, bytes]);
	}

	static concat(bytes: Bytes[]): Bytes {
		const newLength = bytes.reduce(
			(total, current) => total + current.length,
			0,
		);
		const newByteArray = new Uint8Array(newLength);

		let offset = 0;
		for (let index = 0; index < bytes.length; index++) {
			const current = bytes[index];
			newByteArray.set(current.value, offset);
			offset = offset + current.length;
		}

		return Bytes.fromByteArray(newByteArray);
	}

	/**
	 * Attempts to deserialize the Bytes into the '@json' annotated class `<T>`.
	 * @example
	 * ```ts
		@json
		class Data {
			id!: i64;
			value!: string;
		}

		const data = Bytes.fromString("{"id":1,"value":"test"}");

		const responseData = data.toJSON<Data>();

		Console.log(responseData.value); // "test"
	 * ```
	 * @returns an instance of '@json' annotated class <T>
	 */
	toJSON<T>(): T {
		return JSON.parseSafe<T>(this.toUtf8String());
	}

	/**
	 * Serialises a '@json' annotated class (`<T>`) as a string and returns the Bytes representation
	 * of that string.
	 *
	 * @example
	 * ```ts
		@json
		class Data {
			id!: i64;
			value!: string;
		}

		const data = new Data();
		data.id = 1;
		data.value = "test";

		Process.success(Bytes.fromJSON<Data>(data)); // Sets "{"id":1,"value":"test"}" in bytes as the result
	 * ```
	 * @param data an instance of the '@json' annotated class <T>
	 */
	static fromJSON<T>(data: T): Bytes {
		const serialized = JSON.stringify<T>(data);
		return Bytes.fromUtf8String(serialized);
	}

	/**
	 * Creates a new Bytes instance from a number <T>
	 * <T> supports any number type (i8, u8, i16, u16, i32, u32, i64, u64, u128, and u256)
	 *
	 * @example
	 * ```
	 * const number = Bytes.fromNumber<u32>(10);
	 * Console.log(number.toHexString()); // Outputs: 0a000000
	 *
	 * const bigEndianNumber = Bytes.fromNumber<u32>(10, true);
	 * Console.log(number.toHexString()); // Outputs: 0000000a
	 * ```
	 *
	 * @param number the number you want to convert to a Bytes instance
	 * @param bigEndian if you want to store the number as big-endian. Defaults to little-endian
	 */
	static fromNumber<T>(number: T, bigEndian: bool = false): Bytes {
		if (number instanceof u128 || number instanceof u256) {
			const bytes = number.toBytes(bigEndian);
			const byteArray = new Uint8Array(bytes.length);
			byteArray.set(bytes);
			return Bytes.fromByteArray(byteArray);
		}

		const sizeOfNumber = sizeof<T>();
		const buffer = new ArrayBuffer(sizeOfNumber as i32);
		const bufferPtr = changetype<usize>(buffer);

		store<T>(bufferPtr, number);

		// reverse the uint8array to make it big endian
		if (bigEndian) {
			return Bytes.fromByteArray(Uint8Array.wrap(buffer).reverse());
		}

		return Bytes.fromByteArray(Uint8Array.wrap(buffer));
	}

	/**
	 * Convert the Bytes instance to the number <T>
	 * T supports the following number types: (i8, u8, i16, u16, i32, u32, i64 and u64)
	 * for u128 and u256 see {@linkcode Bytes.toU128} and {@linkcode Bytes.toU256}
	 *
	 * @example
	 * ```
	 * const littleEndianBytes = Bytes.fromHexString("0x0a000000");
	 * const num1 = littleEndianBytes.toNumber<u32>();
	 *
	 * Console.log(num1); // Outputs: 10
	 *
	 * const bigEndianBytes = Bytes.fromHexString("0x00000000000000f3");
	 * const number = bigEndianBytes.toNumber<u64>(true);
	 *
	 * Console.log(number); // Outputs: 243
	 * ```
	 *
	 * @param bigEndian if the Bytes instance should be read as big-endian (defaults to little-endian)
	 */
	toNumber<T>(bigEndian: bool = false): T {
		const sizeOfNumber = sizeof<T>();
		this.validateNumberByteLength<T>(sizeOfNumber);

		let typedArray = this.value.slice();

		if (bigEndian) {
			// Numbers in WASM memory are represented in little-endian
			typedArray = typedArray.reverse();
		}

		const bufPtr = changetype<usize>(typedArray.buffer);
		return load<T>(bufPtr);
	}

	/**
	 * Convert the Bytes instance to a u128 number
	 * for smaller number types see {@linkcode Bytes.toNumber}
	 * for u256 see {@linkcode Bytes.toU256}
	 *
	 * @example
	 * ```
	 * const littleEndianBytes = Bytes.fromHexString("0x0000000000000000000000003ade68b1");
	 * const num1 = littleEndianBytes.toU128();
	 *
	 * Console.log(num1); // Outputs: 235817861417383168075506718003194494976
	 *
	 * const bigEndianBytes = Bytes.fromHexString("0x0000000000000000000000003ade68b1");
	 * const number = bigEndianBytes.toU128(true);
	 *
	 * Console.log(number); // Outputs: 987654321
	 * ```
	 *
	 * @param bigEndian if the Bytes instance should be read as big-endian (defaults to little-endian)
	 */
	toU128(bigEndian: bool = false): u128 {
		const sizeOfNumber = offsetof<u128>();
		this.validateNumberByteLength<u128>(sizeOfNumber);

		return u128.fromBytes(this.value, bigEndian);
	}

	/**
	 * Convert the Bytes instance to a u256 number
	 * for smaller number types see {@linkcode Bytes.toNumber}
	 * for u128 see {@linkcode Bytes.toU128}
	 *
	 * @example
	 * ```
	 * const littleEndianBytes = Bytes.fromHexString("0x00000000000000000000000000000000000000000000000000000000075bcd15");
	 * const num1 = littleEndianBytes.toU256();
	 *
	 * Console.log(num1); // Outputs: 9861401716165347554763518477098801055286775394839307868237211366843748450304
	 *
	 * const bigEndianBytes = Bytes.fromHexString("0x00000000000000000000000000000000000000000000000000000000075bcd15");
	 * const number = bigEndianBytes.toU256(true);
	 *
	 * Console.log(number); // Outputs: 123456789
	 * ```
	 *
	 * @param bigEndian if the Bytes instance should be read as big-endian (defaults to little-endian)
	 */
	toU256(bigEndian: bool = false): u256 {
		const sizeOfNumber = offsetof<u256>();
		this.validateNumberByteLength<u256>(sizeOfNumber);

		return u256.fromBytes(this.value, bigEndian);
	}

	/**
	 * Convert the Bytes instance to a boolean value.
	 * Returns true if either the first or last byte in the array is non-zero, false if both are zero. Note that this only checks the first and last byte.
	 * 
	 * @example
	 * ```ts
	 * const trueBytes = Bytes.fromHexString("0x01");
	 * Console.log(trueBytes.toBool()); // true
	 * 
	 * const falseBytes = Bytes.fromHexString("0x00");
	 * Console.log(falseBytes.toBool()); // false
	 * 
	 * const multiByteTrue = Bytes.fromHexString("0x0100000000");
	 * Console.log(multiByteTrue.toBool()); // true
	 * ```
	 */
	toBool(): bool {
		let firstByte = this.value.at(0);
		
		if (firstByte !== 0) {
			return true;
		}

		let lastByte = this.value.at(this.value.byteLength - 1);

		if (lastByte !== 0) {
			return true;
		}

		return false;
	}

	// Make sure the byte amount is exactly the amount required for an integer
	// Otherwise we could interpret the bytes wrong
	private validateNumberByteLength<T>(sizeOfNumber: usize): void {
		if ((this.length as usize) !== sizeOfNumber) {
			const typeName = nameof<T>();
			throw new Error(
				`Type ${typeName} has a byte length of ${sizeOfNumber}, but the Bytes instance has a length of ${this.length}`,
			);
		}
	}
}
