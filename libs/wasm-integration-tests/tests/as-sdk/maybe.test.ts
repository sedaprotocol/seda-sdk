import { describe, expect, it } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("as-sdk:Maybe", () => {
	it("should correctly handle Just and Nothing values", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testMaybeUsage"),
		);

		expect(result.exitCode).toBe(0);
	});
});
