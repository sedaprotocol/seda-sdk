import { describe, expect, it, setDefaultTimeout } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("rs-sdk:timeout", () => {
	setDefaultTimeout(60_000);

	it("user timeout reached", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testUserHttpShouldTimeout"),
			undefined,
			300_000_000_000_000n,
			true,
		);

		expect(result.exitCode).toBe(1);
		expect(result.resultAsString).toInclude(
			"HTTP fetch time limit exceeded (1000ms)",
		);
	});

	it("user timeout specified but not reached", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testUserHttpNoTimeout"),
			undefined,
			300_000_000_000_000n,
			true,
		);

		expect(result.exitCode).toBe(0);
	});

	it("user timeout not reached but global timeout reached", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testLongFetch"),
			undefined,
			300_000_000_000_000n,
			true,
			{
				totalHttpTimeLimit: 5000,
			},
		);

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toInclude(
			"Global HTTP fetch time limit exceeded (5000ms)",
		);
	});
});
