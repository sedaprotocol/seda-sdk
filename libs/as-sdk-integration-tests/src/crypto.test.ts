import { beforeEach, describe, expect, it, mock } from "bun:test";
import { readFile } from "node:fs/promises";
import { executeDrWasm } from "@seda/dev-tools";
import { Response } from "node-fetch";

const mockHttpFetch = mock();

describe("Crypto", () => {
	it("Test valid Secp256k1 signature", async () => {
		const wasmBinary = await readFile(
			"dist/libs/as-sdk-integration-tests/debug.wasm",
		);

		const result = await executeDrWasm(
			wasmBinary,
			Buffer.from("testSecp256k1VerifyValid"),
		);

		expect(result.resultAsString).toEqual("valid secp256k1 signature");
	});

	it("Test invalid Secp256k1 signature", async () => {
		const wasmBinary = await readFile(
			"dist/libs/as-sdk-integration-tests/debug.wasm",
		);

		const result = await executeDrWasm(
			wasmBinary,
			Buffer.from("testSecp256k1VerifyInvalid"),
		);

		expect(result.resultAsString).toEqual("invalid secp256k1 signature");
	});
});
