import { JSON } from '../../../node_modules/assemblyscript-json/assembly/index';

export function jsonArrToUint8Array(array: JSON.Arr): Uint8Array {
  const bytes: u8[] = [];
  const innerArrayValue = array.valueOf();

  for (let i = 0; i < innerArrayValue.length; i++) {
    const element = <JSON.Integer>innerArrayValue[i];
    bytes.push(u8(element.valueOf()));
  }

   const result = new Uint8Array(bytes.length);
   result.set(bytes);

   return result;
}
