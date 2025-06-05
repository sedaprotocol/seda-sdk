import { describe, expect, it } from "bun:test";
import { testOracleProgramTally } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("rs-sdk:tally-determinism", () => {
	it("should panic when using the default hashmap", async () => {
		const result = await testOracleProgramTally(
			oracleProgram,
			Buffer.from("testTallyHashMap"),
			[],
			50_000_000_000_000n,
		);

		expect(result.exitCode).toBe(1);
		// Sadly we can't know that it was HashMap that triggered the `random_get` import error
		expect(result.stderr).toContain("import random_get was not a function");
	});

	it("should not panic when using our deterministic hashmap", async () => {
		const result = await testOracleProgramTally(
			oracleProgram,
			Buffer.from("testTallyDeterministicHashMap"),
			[],
			50_000_000_000_000n,
		);

		expect(result.exitCode).toBe(0);
		expect(result.result).toEqual(Buffer.from('{"key":"value"}'));
	});
});
