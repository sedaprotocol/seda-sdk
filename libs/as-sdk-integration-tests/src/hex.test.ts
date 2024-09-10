import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { executeDrWasm } from "@seda/dev-tools";

describe("hex", () => {
	it("should encode hex to the same string that came in", async () => {
		const wasmBinary = await readFile(
			"dist/libs/as-sdk-integration-tests/debug.wasm",
		);

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
