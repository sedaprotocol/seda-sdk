import { u256 } from "as-bignum/assembly";
import { Bytes } from "./bytes";
import { Console } from "./console";
import { toString } from "./string-utils";

export class AbiValue extends Bytes {
	type: string = "AbiValue";

	constructor(
		value: Bytes | null,
		public array: AbiValue[] | null,
	) {
		const bytes = value === null ? Bytes.empty() : value;
		super(bytes.value);
	}

	isArray(): bool {
		return this.array !== null;
	}

	asArray(): Bytes[] {
		const arr = this.array;

		if (arr === null) {
			throw new Error("Called 'asArray' on a non array AbiValue");
		}

		return AbiValue.arrayToBytes(arr);
	}

	static fromBytes(value: Bytes): AbiValue {
		return new AbiValue(value, null);
	}

	/**
	 * Converts an array of AbiValues to an array of Bytes.
	 * This helper method is needed because AssemblyScript does not support direct array mapping
	 * between different types, even if they inherit from each other.
	 *
	 * @param values - Array of AbiValues to convert
	 * @returns Array of Bytes objects containing the same underlying byte data
	 * @example
	 * ```ts
	 * const abiValues = [
	 *   AbiValue.fromBytes(Bytes.fromUtf8String("hello")),
	 *   AbiValue.fromBytes(Bytes.fromUtf8String("world"))
	 * ];
	 * const bytesArray = AbiValue.arrayToBytes(abiValues);
	 * // bytesArray is now [Bytes("hello"), Bytes("world")]
	 * ```
	 */
	static arrayToBytes(values: AbiValue[]): Bytes[] {
		return values.map((v: AbiValue) => Bytes.fromByteArray(v.value));
	}

	static fromArray(value: AbiValue[]): AbiValue {
		return new AbiValue(null, value);
	}

	toString(): string {
		const arr = this.array;
		if (arr !== null) {
			return toString(arr as AbiValue[]);
		}

		const value = this.value;
		if (value !== null) {
			return toString(value);
		}

		return "AbiValue(0x)";
	}
}

export function abiDecode(abi: string[], input: Bytes): AbiValue[] {
	let cursor: i32 = 0;

	// index in abi array => dynamic info
	const dynamicInfo: Map<i32, Bytes> = new Map();
	const decodedInfo = new Array<AbiValue>(abi.length);

	// First get out all the information of each variable
	for (let i: i32 = 0; i < abi.length; i++) {
		const variableType = abi[i];
		const info = input.slice(cursor, cursor + 32);
		cursor += 32;

		if (variableType.endsWith("[]")) {
			dynamicInfo.set(i, info);
		} else if (variableType.includes("int")) {
			// Handle both signed (int) and unsigned (uint) integers of any size (8-256 bits)
			// Since we're working with the raw bytes, we don't need special handling for different sizes
			decodedInfo[i] = AbiValue.fromBytes(info);
		} else if (variableType === "bool") {
			decodedInfo[i] = AbiValue.fromBytes(info);
		} else if (variableType === "string" || variableType === "bytes") {
			dynamicInfo.set(i, info);
		} else if (variableType.includes("bytes") || variableType === "address") {
			decodedInfo[i] = AbiValue.fromBytes(info);
		} else {
			throw new Error(`Type "${variableType}" is not supported`);
		}
	}

	// Now the cursor is at the end of the fixed length variables and dynamic information
	// We should now process the dynamic variables.
	const dynamicVariableKeys = dynamicInfo.keys();

	for (let j: i32 = 0; j < dynamicVariableKeys.length; j++) {
		const dynamicIndex = dynamicVariableKeys[j];
		const abiInfo = abi[dynamicIndex];

		const dynamicBytesLengthInfo = dynamicInfo.get(dynamicIndex);
		const offset = dynamicBytesLengthInfo.toU256(true).toI32();
		const length = input.slice(offset, offset + 32).toU256(true);

		if (abiInfo.endsWith("[]")) {
			const abiType = abiInfo.replace("[]", "");

			// In this case the length property means length of the array
			const expectedAbi: string[] = new Array<string>(length.toI32()).fill(
				abiType,
			);

			if (abiInfo.startsWith("string") || abiInfo === "bytes[]") {
				// TODO: Support dynamic length values
				decodedInfo[dynamicIndex] = AbiValue.fromArray([]);
				throw new Error(
					"Dynamic array values are currently not supported (string[] & bytes[])",
				);
			}

			const arrayBytesSlice = input.slice(
				offset + 32,
				offset + 32 + length.toI32() * 32,
			);
			const arrayBytes = abiDecode(expectedAbi, arrayBytesSlice);
			decodedInfo[dynamicIndex] = AbiValue.fromArray(arrayBytes);
		} else {
			// string and bytes behave the same way in abi
			// WARN: We are losing some precision here, but since dynamic values are usually not bigger than i32 we are ok..
			const result = input.slice(offset + 32, offset + 32 + length.toI32());
			decodedInfo[dynamicIndex] = AbiValue.fromBytes(result);
		}
	}

	return decodedInfo;
}

export function abiEncode(abi: string[], input: Bytes[]): Bytes {
	let result = Bytes.empty();
	const danglingBytes: Bytes[] = [];
	const danglingOffset = input.length * 32;

	for (let i = 0; i < input.length; i++) {
		const abiType = abi[i];
		const variable = input[i];

		if (abiType === "string" || abiType === "bytes") {
			// We only add the offset to the result
			const offset = danglingOffset + 32 * i;
			result = result.concat(Bytes.fromNumber(u256.from(offset), true));

			const lengthBytes = Bytes.fromNumber(u256.from(variable.length), true);
			const stringBytes = lengthBytes.concat(variable.pad32());

			danglingBytes.push(stringBytes);
		} else if (abiType.includes("int")) {
			// Handle both signed (int) and unsigned (uint) integers of any size (8-256 bits)
			// Since we're working with the raw bytes, we don't need special handling for different sizes
			result = result.concat(variable.pad32(false));
		} else if (abiType.includes("bytes") || abiType === "address") {
			result = result.concat(variable.pad32(false));
		} else if (abiType === "bool") {
			result = result.concat(variable.pad32(false));
		}
	}

	for (let i = 0; i < danglingBytes.length; i++) {
		const element = danglingBytes[i];
		result = result.concat(element);
	}

	return result;
}
