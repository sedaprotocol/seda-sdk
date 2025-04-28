import { describe, expect, it } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("rs-sdk:errors", () => {
	it("should panic without revealing the stacktrace", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testPanic"),
			undefined,
			50_000_000_000_000n,
			true,
		);

		expect(result.exitCode).toBe(1);
		expect(result.stderr).not.toContain(".js");
		expect(result.stderr).not.toContain("JsValue");
	});

	it("should not show the stacktrace when the program panics due to a gas limit", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testInfiniteLoop"),
			undefined,
			50_000_000_000_000n,
		);

		expect(result.exitCode).toBe(1);
		expect(result.stderr).not.toContain(".js");
		expect(result.stderr).not.toContain("JsValue");
		expect(result.stderr).toBe("\nRan out of gas");
	});
});
