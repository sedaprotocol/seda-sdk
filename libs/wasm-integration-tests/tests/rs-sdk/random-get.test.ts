import { describe, expect, it, setDefaultTimeout } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("rs-sdk:random-get", () => {
	setDefaultTimeout(30_000);

	it("should return a random byte", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testRandomGet"),
			undefined,
			50_000_000_000_000n,
			true,
		);

		expect(result.exitCode).toBe(0);
		expect(result.gasUsed).toBeGreaterThan(8000000000000n);
		expect(result.result).toHaveLength(1);
	});
});
