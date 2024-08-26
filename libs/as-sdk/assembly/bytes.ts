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

    constructor(value: Uint8Array) {
        this.value = value;
    }

    __SERIALIZE(): string {
        const inner = new InnerBytes();
        inner.value = encodeHex(this.value);

        return JSON.stringify(inner);
    }

    __INITIALIZE(): void {}

    __DESERIALIZE(data: string, _key_start: i32, _key_end: i32, _outerLoopIndex: i32, _numberValueIndex: i32): bool {
        const innerBytes = JSON.parse<InnerBytes>(data);
        const buffer = decodeHex(innerBytes.value);
        this.value = buffer;

        return true;
    }
}
