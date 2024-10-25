import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { testOracleProgramExecution } from "@seda/dev-tools";

const oracleProgram = await readFile(
	"dist/libs/as-sdk-integration-tests/debug.wasm",
);

describe("invalid json", () => {
	describe("invalid attribute", () => {
		it("should mention the mismatched type", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testInvalidAttribute"),
			);

			expect(result.exitCode).toBe(255);
			expect(result.stderr).toContain(
				"Mismatched Types! Expected string but got",
			);
		});
	});
});
