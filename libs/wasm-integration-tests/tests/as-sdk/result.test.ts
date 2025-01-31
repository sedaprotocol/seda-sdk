import { describe, expect, it } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";
describe("as-sdk:Result", () => {
	it("should correctly handle Ok and Err values", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testResultUsage"),
		);

		expect(result.exitCode).toBe(0);
	});
});
