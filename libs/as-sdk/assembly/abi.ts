import { u256 } from "as-bignum/assembly";
import { Bytes } from "./bytes";

export function abiDecode(abi: string[], input: Bytes): Bytes[] {
    let cursor: i32 = 0;

    // index in abi array => dynamic info
    let dynamicInfo: Map<i32, Bytes> = new Map();
    let decodedInfo = new Array<Bytes>(abi.length);

    // First get out all the information of each variable
    for (let i: i32 = 0; i < abi.length; i++) {
        const variableType = abi[i];
        const info = input.slice(cursor, cursor + 32);
        cursor += 32;
        
        if (variableType.includes("int")) {
            // Handle both signed (int) and unsigned (uint) integers of any size (8-256 bits)
            // Since we're working with the raw bytes, we don't need special handling for different sizes
            decodedInfo[i] = info;
        } else if (variableType === "bool") {
            decodedInfo[i] = info;
        } else if (variableType === "string" || variableType === "bytes") {
            dynamicInfo.set(i, info);
        } else if (variableType.includes("bytes") || variableType === "address") {
            decodedInfo[i] = info;
        } else {
            throw new Error(`Type "${variableType}" is not supported`);
        }
    }

    // Now the cursor is at the end of the fixed length variables and dynamic information
    // We should now process the dynamic variables.
    const dynamicVariableKeys= dynamicInfo.keys();

    for (let j: i32 = 0; j < dynamicVariableKeys.length; j++) {
        const dynamicIndex = dynamicVariableKeys[j];
        const dynamicBytesLengthInfo = dynamicInfo.get(dynamicIndex);
        const offset = dynamicBytesLengthInfo.toU256(true).toI32();
        const length = input.slice(offset, offset + 32).toU256(true);

        // WARN: We are losing some precision here, but since dynamic values are usually not bigger than i32 we are ok..
        const result = input.slice(offset + 32, offset + 32 + length.toI32());
        decodedInfo[dynamicIndex] = result;
    }

    return decodedInfo;
}

export function abiEncode(abi: string[], input: Bytes[]): Bytes {
    let result = Bytes.empty();
    let danglingBytes: Bytes[] = [];
    const danglingOffset = input.length * 32;

    for (let i = 0; i < input.length; i++) {
        const abiType = abi[i];
        const variable = input[i];

        if (abiType === "string" || abiType === "bytes") {
            // We only add the offset to the result
            const offset = danglingOffset + (32 * i);
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