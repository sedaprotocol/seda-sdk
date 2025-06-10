import { describe, expect, it, setDefaultTimeout } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("rs-sdk:timeout", () => {
	setDefaultTimeout(60_000);

	it("local timeout reached", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testUserHttpTimeout"), // fetch with 1000ms timeout for an endpoint that responds in 5000ms
			undefined,
			300_000_000_000_000n,
			true,
		);

		expect(result.exitCode).toBe(1);
		expect(result.resultAsString).toInclude(
			"HTTP fetch time limit exceeded (1000ms)",
		);
	});

	it("local timeout specified but not reached", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testUserHttpNoTimeout"), // fetch with 5000ms timeout for an endpoint that responds in 1000ms
			undefined,
			300_000_000_000_000n,
			true,
		);

		expect(result.exitCode).toBe(0);
	});

	it("local timeout not reached but global timeout reached", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testLongFetch"), // fetch with 20000ms timeout for an endpoint that takes 10000ms to respond
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
