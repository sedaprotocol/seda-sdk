import { jsonArrToUint8Array, JSON, testutils } from '../../as-sdk/assembly/index';

export function testValidUint8JsonArray(): void {
  const raw: string = "[0, 23, 254, 88]";
  const json = <JSON.Arr>JSON.parse(raw);
  const result = jsonArrToUint8Array(json);

  const expected = new Uint8Array(4);
  expected.set([0, 23, 254, 88]);

  testutils.assert(result.byteLength === expected.byteLength, "bytelength is not equal");
  testutils.assert(
    String.UTF8.decode(result.buffer) === String.UTF8.decode(expected.buffer),
    'buffers are not equal'
  );

  testutils.ok();
}

export function testInvalidUint8JsonArray(): void {
  const raw: string = '[0, 23, 299, 88]';
  const json = <JSON.Arr>JSON.parse(raw);
  jsonArrToUint8Array(json);

  testutils.error("Test should fail");
}
