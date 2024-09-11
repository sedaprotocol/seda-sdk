import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { executeDrWasm } from "@seda/dev-tools";

const wasmBinary = await readFile(
	"dist/libs/as-sdk-integration-tests/debug.wasm",
);

describe("encoding", () => {
	describe("hex", () => {
		it("should encode hex to the same string that came in", async () => {
			const result = await executeDrWasm(
				wasmBinary,
				Buffer.from(
					"000000000000c886c362e71402e05b3b6132b2e23832bcbc42f1",
					"hex",
				),
			);

			expect(result.resultAsString).toEqual(
				"000000000000c886c362e71402e05b3b6132b2e23832bcbc42f1",
			);
		});
	});

	describe("bytes", () => {
		it("should correctly decode/encode hex strings", async () => {
			const result = await executeDrWasm(
				wasmBinary,
				Buffer.from("testBytesHexEncodeDecode"),
			);

			expect(result.resultAsString).toEqual(
				"006e75ec00000000000000000000000000000000000000000000",
			);
		});

		it("should ignore 0x prefixes in hex strings", async () => {
			const result = await executeDrWasm(
				wasmBinary,
				Buffer.from("testBytesPrefixedHexDecode"),
			);

			expect(result.resultAsString).toEqual(
				"006e75ec00000000000000000000000000000000000000000000",
			);
		});
	});
});
