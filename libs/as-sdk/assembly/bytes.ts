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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    __DESERIALIZE(data: string, _key_start: i32, _key_end: i32, _outerLoopIndex: i32, _numberValueIndex: i32): bool {
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

    static fromString(payload: string): Bytes {
      const msg = String.UTF8.encode(payload);
      return new Bytes(Uint8Array.wrap(msg));
    }

    static fromBytes(payload: Uint8Array): Bytes {
      return new Bytes(payload);
    }

    static empty(): Bytes {
      return new Bytes(new Uint8Array(0));
    }
}
