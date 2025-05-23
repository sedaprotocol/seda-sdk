import { describe, expect, it } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("as-sdk:Console", () => {
	it("should print a hex representation of a raw buffer", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testLogBuffer"),
		);

		expect(result.stdout).toEqual("ArrayBuffer(0x627566666572)\n");
	});

	it("should print a hex representation of a Uint8Array", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testLogByteArray"),
		);

		expect(result.stdout).toEqual("TypedArray(0x54797065644172726179)\n");
	});

	it("should print a float value", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testLogFloat"),
		);

		expect(result.stdout).toEqual("0.3199999928474426\n");
	});

	it("should print a null value", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testLogNull"),
		);

		expect(result.stdout).toEqual("null\n");
	});
});
