import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { testOracleProgramExecution } from "@seda/dev-tools";

const oracleProgram = await readFile(
	"dist/libs/as-sdk-integration-tests/debug.wasm",
);

describe("Result", () => {
	it("should correctly handle Ok and Err values", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testResultUsage"),
		);

		expect(result.exitCode).toBe(0);
	});
});
