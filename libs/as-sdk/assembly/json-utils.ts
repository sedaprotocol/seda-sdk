export function jsonArrToUint8Array(array: u8[]): Uint8Array {
  const result = new Uint8Array(array.length);
  result.set(array);

  return result;
}
