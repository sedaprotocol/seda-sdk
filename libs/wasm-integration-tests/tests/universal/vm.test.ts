import { describe, expect, it } from "bun:test";
import {
	testOracleProgramExecution,
	testOracleProgramTally,
} from "@seda/dev-tools";
import { sdks } from "./sdks";

describe("Vm", () => {
	it("should exit when an invalid Oracle Program is given", async () => {
		const result = await testOracleProgramExecution(
			Buffer.from(new Uint8Array([0, 97, 115, 109])),
			Buffer.from("testHttpSuccess"),
		);

		expect(result).toEqual({
			exitCode: 1,
			stderr: expect.any(String),
			stdout: "",
			result: new Uint8Array(0),
			gasUsed: 5000000300000n,
			resultAsString: "",
		});

		expect(result.stderr.length).toBeGreaterThan(0);
	});
});

describe.each(sdks)("%s:Vm", (_, oracleProgram) => {
	it("should run in dr vm mode by default", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testTallyVmMode"),
		);

		expect(result.resultAsString).toEqual("dr");
		expect(result.exitCode).toBe(1);
	});

	it("should run in tally vm mode with the adapter", async () => {
		const result = await testOracleProgramTally(
			oracleProgram,
			Buffer.from("testTallyVmMode"),
			[],
		);

		expect(result.resultAsString).toEqual("tally");
		expect(result.exitCode).toBe(0);
	});

	it("should fail to make a http call with the tally adapter", async () => {
		const result = await testOracleProgramTally(
			oracleProgram,
			Buffer.from("testTallyVmHttp"),
			[],
		);

		expect(result.resultAsString).toEqual("http_fetch is not allowed in tally");
		expect(result.exitCode).toBe(0);
	});
});
