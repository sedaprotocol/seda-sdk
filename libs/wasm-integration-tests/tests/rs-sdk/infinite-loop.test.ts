import { describe, expect, it, setDefaultTimeout } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("rs-sdk:infinite-loop", () => {
	setDefaultTimeout(30_000);

	it("should stop when a program has not a lot of gas attached to it", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testInfiniteLoop"),
			undefined,
			20n,
		);

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toBe("\nRan out of gas");
		expect(result.gasUsed).toBe(5000000380000n);
	});

	it("should stop when a program is an infintite loop", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testInfiniteLoop"),
			undefined,
			300_000_000_000_000n,
		);

		expect(result.exitCode).toBe(1);
		// Gas metering in JS works on branches instead of a per opcode basis..
		expect(result.gasUsed).toBe(300000002470000n);
	});
});
