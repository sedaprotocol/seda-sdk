import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { executeDrWasm } from "@seda/dev-tools";

const wasmBinary = await readFile(
	"dist/libs/as-sdk-integration-tests/debug.wasm",
);

describe("console", () => {
	it("should print a hex representation of a raw buffer", async () => {
		const result = await executeDrWasm(
			wasmBinary,
			Buffer.from("testLogBuffer"),
		);

		expect(result.stdout).toEqual("ArrayBuffer(0x627566666572)\n");
	});

	it("should print a hex representation of a Uint8Array", async () => {
		const result = await executeDrWasm(
			wasmBinary,
			Buffer.from("testLogByteArray"),
		);

		expect(result.stdout).toEqual("TypedArray(0x54797065644172726179)\n");
	});
});