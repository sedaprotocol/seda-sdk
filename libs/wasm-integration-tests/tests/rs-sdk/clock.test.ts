import { describe, expect, it, setDefaultTimeout } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("rs-sdk:clock", () => {
	it("should get the current time", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testClockTimeGet"),
			undefined,
			undefined,
		);

		const timestamp = Date.now();
		const resultTimestamp = Number.parseInt(result.resultAsString ?? "0");

		expect(result.exitCode).toBe(0);
		// Max drift of 100ms (If it drift more than 100ms, it means that the program is not using the correct clock)
		expect(Math.abs(timestamp - resultTimestamp)).toBeLessThan(100);
	});
});
