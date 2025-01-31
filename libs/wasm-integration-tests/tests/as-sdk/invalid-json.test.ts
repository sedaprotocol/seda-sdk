import { describe, expect, it } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("as-sdk:invalid json", () => {
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
