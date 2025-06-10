import { describe, expect, it, setDefaultTimeout } from "bun:test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { testOracleProgramExecution } from "@seda/dev-tools";

const tallyProgram = await readFile(
	resolve(import.meta.dir, "../../tall-2.wasm"),
);

const tooMuchMemoryProgram = await readFile(
	resolve(import.meta.dir, "../../assign_too_much_memory.wasm"),
);

describe("metering", () => {
	setDefaultTimeout(30_000);

	// TODO: Test with creating a program that grows its memory every loop
	// And just start with an initial of 1
	it("should run out of gas when there is not enough memory", async () => {
		const result = await testOracleProgramExecution(
			tooMuchMemoryProgram,
			Buffer.from("not_used"),
			undefined,
			3000000000000000n,
			true,
		);

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toInclude(
			"resizable limits has an initial page count of 65536 which is greater than its maximum",
		);
	});

	it("should run out of gas when there is not enough gas attached to it", async () => {
		const result = await testOracleProgramExecution(
			tallyProgram,
			Buffer.from("not_used"),
			undefined,
			20n,
		);

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toBe("Ran out of gas");
	});
});
