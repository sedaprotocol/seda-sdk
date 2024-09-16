import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { executeDrWasm } from "@seda/dev-tools";

const wasmBinary = await readFile(
	"dist/libs/as-sdk-integration-tests/debug.wasm",
);

describe("bytes", () => {
	describe("slice", () => {
		it("should return a new bytes instance when called without arguments", async () => {
			const result = await executeDrWasm(
				wasmBinary,
				Buffer.from("testBytesSliceNoArguments"),
			);

			expect(result.stdout).toEqual(
				"\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\n",
			);
			expect(result.resultAsString).toEqual("testBytesSliceNoArguments");
		});

		it("should return a new bytes instance when called with just the start", async () => {
			const result = await executeDrWasm(
				wasmBinary,
				Buffer.from("testBytesSliceOnlyStart"),
			);

			expect(result.resultAsString).toEqual("OnlyStart");
		});

		it("should return a new bytes instance when called with start and end", async () => {
			const result = await executeDrWasm(
				wasmBinary,
				Buffer.from("testBytesSliceStartEnd"),
			);

			expect(result.resultAsString).toEqual("Slice");
		});
	});

	describe("json", () => {
		it("should be possible to parse Bytes as JSON and output Bytes as JSON", async () => {
			const input = JSON.stringify({
				id: 1,
				value: "none",
				important: false,
				list: ["first", "second"],
				nested: {
					id: 999,
					value: "some",
				},
			});
			const result = await executeDrWasm(
				wasmBinary,
				Buffer.from(`testBytesJSON:${input}`),
			);

			expect(result.resultAsString).toEqual(
				'{"id":1,"firstList":"first","nestedValue":"some"}',
			);
		});
	});
});
