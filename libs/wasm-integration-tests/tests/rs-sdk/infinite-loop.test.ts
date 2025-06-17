import { describe, expect, it, setDefaultTimeout } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("rs-sdk:infinite-loop", () => {
	setDefaultTimeout(60_000);

	it("should stop when a program has not a lot of gas attached to it", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testInfiniteLoop"),
			undefined,
			20n,
		);

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toBe("Ran out of gas");
		expect(result.gasUsed).toBe(5000000320000n);
	});

	it("should stop when a program is an infinite loop", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testInfiniteLoop"),
			undefined,
			300_000_000_000_000n,
		);

		expect(result.exitCode).toBe(1);
		expect(result.gasUsed).toBeGreaterThanOrEqual(300000000000000n);
	});

	it("should stop when a program is an infinite loop of http fetches", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testInfiniteLoopHttpFetch"),
			undefined,
			300_000_000_000_000n,
			true,
		);

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toBe("Ran out of gas");
	});
});
