import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { testOracleProgramExecution } from "@seda/dev-tools";

const oracleProgram = await readFile(
	"dist/libs/as-sdk-integration-tests/debug.wasm",
);

describe("Maybe", () => {
	it("should correctly handle Just and Nothing values", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testMaybeUsage"),
		);

		expect(result.exitCode).toBe(0);
	});
});
