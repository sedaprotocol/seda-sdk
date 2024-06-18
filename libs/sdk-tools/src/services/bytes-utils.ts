export function stringToBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

export function hexToBytes(value: string): Uint8Array {
  return Buffer.from(value, "hex");
}

export function toHexString(byteArray: Uint8Array) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}
