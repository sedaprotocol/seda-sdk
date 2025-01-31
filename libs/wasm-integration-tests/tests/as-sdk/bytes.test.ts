import { describe, expect, it } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("as-sdk:Bytes", () => {
	describe("concat", () => {
		it("should concatenate 2 Bytes instances in a new one", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testBytesConcat:world!"),
			);

			expect(result.resultAsString).toBe("Hello, world!");
		});

		it("should allow passing an array of bytes to the static method and concatenate them", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testBytesStaticConcat:swap"),
			);

			expect(result.resultAsString).toBe("swap:testBytesStaticConcat");
		});
	});

	describe("slice", () => {
		it("should return a new bytes instance when called without arguments", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testBytesSliceNoArguments"),
			);

			expect(result.stdout).toEqual(
				"\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\n",
			);
			expect(result.resultAsString).toEqual("testBytesSliceNoArguments");
		});

		it("should return a new bytes instance when called with just the start", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testBytesSliceOnlyStart"),
			);

			expect(result.resultAsString).toEqual("OnlyStart");
		});

		it("should return a new bytes instance when called with start and end", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testBytesSliceStartEnd"),
			);

			expect(result.resultAsString).toEqual("Slice");
		});
	});

	describe("json", () => {
		it("should be possible to parse Bytes as JSON and output Bytes as JSON", async () => {
			const input = JSON.stringify({
				id: 1,
				value: "none",
				important: false,
				list: ["first", "second"],
				nested: {
					id: 999,
					value: "some",
				},
			});
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from(`testBytesJSON:${input}`),
			);

			expect(result.resultAsString).toEqual(
				'{"id":1,"firstList":"first","nestedValue":"some"}',
			);
		});
	});

	describe("toNumber", () => {
		it("should be able to parse a number to a type", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testBytesToNumber"),
			);

			expect(result.resultAsString).toBe("254:243");
		});
	});

	describe("fromNumber", () => {
		it("should convert a number to a bytes object", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testNumberToBytes"),
			);

			expect(result.resultAsString).toBe(
				"ffffffffffffffff:8000000000000000:18446744073709551615:-9223372036854775808",
			);
		});
	});

	describe("fromBigNumber", () => {
		it("should convert a big number to Bytes", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testBigNumberToBytes"),
			);

			expect(result.resultAsString).toBe(
				"ffffffffffffffffffffffffffffffff:340282366920938463463374607431768211455,0000000000000000000000003ade68b1:987654321,ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff:115792089237316195423570985008687907853269984665640564039457584007913129639935,00000000000000000000000000000000000000000000000000000000075bcd15:123456789",
			);
		});
	});

	describe("toBigNumber", () => {
		it("should be able to parse Bytes as a big number", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testBytesToBigNumber"),
			);

			expect(result.resultAsString).toBe(
				"235817861417383168075506718003194494976:123456789",
			);
		});
	});

	describe("hex", () => {
		it("should correctly decode/encode hex strings", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testBytesHexEncodeDecode"),
			);

			expect(result.resultAsString).toEqual(
				"006e75ec00000000000000000000000000000000000000000000",
			);
		});

		it("should ignore 0x prefixes in hex strings", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testBytesPrefixedHexDecode"),
			);

			expect(result.resultAsString).toEqual(
				"006e75ec00000000000000000000000000000000000000000000",
			);
		});
	});
});
