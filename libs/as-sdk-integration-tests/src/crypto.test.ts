import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { executeDrWasm } from "@seda/dev-tools";

const wasmBinary = await readFile(
	"dist/libs/as-sdk-integration-tests/debug.wasm",
);

describe("Crypto", () => {
	it("Test valid Secp256k1 signature", async () => {
		const result = await executeDrWasm(
			wasmBinary,
			Buffer.from("testSecp256k1VerifyValid"),
		);

		expect(result.resultAsString).toEqual("valid secp256k1 signature");
	});

	it("Test invalid Secp256k1 signature", async () => {
		const result = await executeDrWasm(
			wasmBinary,
			Buffer.from("testSecp256k1VerifyInvalid"),
		);

		expect(result.resultAsString).toEqual("invalid secp256k1 signature");
	});

	describe("keccak256", () => {
		it("should hash the input bytes correctly", async () => {
			const result = await executeDrWasm(
				wasmBinary,
				Buffer.from("testKeccak256"),
			);

			expect(result.resultAsString).toEqual(
				"fe8baa653979909c621153b53c973bab3832768b5e77896a5b5944d20d48c7a6",
			);
		});
	});
});
