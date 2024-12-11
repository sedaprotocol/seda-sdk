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
        
        if (variableType.startsWith("uint")) {
            decodedInfo[i] = info;
        } else if (variableType === "bool") {
            decodedInfo[i] = info;
        } else if (variableType === "string" || variableType === "bytes") {
            dynamicInfo.set(i, info);
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