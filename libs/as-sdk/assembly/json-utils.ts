export function jsonArrToUint8Array(array: u8[]): Uint8Array {
  const result = new Uint8Array(array.length);
  result.set(array);

  return result;
}

export function uint8arrayToJsonArray(input: Uint8Array): u8[] {
  const result: u8[] = [];
  
  for (let i = 0; i < input.length; i++) {
    result.push(input[i]);
  }

  return result;
}