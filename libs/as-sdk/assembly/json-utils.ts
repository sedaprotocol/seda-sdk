import { Bytes } from "./bytes";

export function jsonArrToUint8Array(array: u8[]): Uint8Array {
  const result = new Uint8Array(array.length);
  result.set(array);

  return result;
}

export function bytesToJsonArray(input: Bytes | null): u8[] {
  const result: u8[] = [];

  if (input === null) {
    return result;
  }

  for (let i = 0; i < input.value.length; i++) {
    result.push(input.value[i]);
  }

  return result;
}
