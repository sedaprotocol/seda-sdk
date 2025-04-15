import { describe, expect, it } from "bun:test";
import { encodeConsensusFilter } from "./consensus-filter";

describe("encodeConsensusFilter", () => {
	describe("invalid method", () => {
		it("should throw an error for an unknown mode", () => {
			expect(() => {
				// @ts-expect-error Force invalid inout
				encodeConsensusFilter({ method: "madness" });
			}).toThrowError();
		});
	});

	describe("method: none", () => {
		it("should encode a valid JSON path", () => {
			const result = encodeConsensusFilter({
				method: "none",
			});

			const resultAsHex = Buffer.from(result).toString("hex");

			expect(resultAsHex).toBe("00");
		});
	});

	describe("method: mode", () => {
		it("should encode a valid JSON path", () => {
			const result = encodeConsensusFilter({
				method: "mode",
				jsonPath: "$.result.text",
			});

			const resultAsHex = Buffer.from(result).toString("hex");

			// Taken from chain unit tests
			expect(resultAsHex).toBe("01000000000000000d242e726573756c742e74657874");
		});

		it("should fail on an invalid JSON path", () => {
			expect(() => {
				// @ts-expect-error Force invalid inout
				encodeConsensusFilter({ method: "mode", jsonPath: "result.text" });
			}).toThrowError();
		});
	});

	describe("method: MAD", () => {
		// Taken from chain unit tests
		it.each([
			{
				input: {
					jsonPath: "$.result.text",
					maxSigma: 1.5,
					numberType: "uint64",
				},
				expectedResult:
					"02000000000016E36003000000000000000D242E726573756C742E74657874",
			},
			{
				input: {
					jsonPath: "$.result.text",
					maxSigma: 1.5,
					numberType: "int64",
				},
				expectedResult:
					"02000000000016E36002000000000000000D242E726573756C742E74657874",
			},
			{
				input: {
					jsonPath: "$.result.text",
					maxSigma: 0.5,
					numberType: "int64",
				},
				expectedResult:
					"02000000000007A12002000000000000000D242E726573756C742E74657874",
			},
			{
				input: {
					jsonPath: "$",
					maxSigma: 1,
					numberType: "uint128",
				},
				expectedResult: "0200000000000F424005000000000000000124",
			},
			{
				input: {
					jsonPath: "$[0].result.value",
					maxSigma: 1,
					numberType: "int256",
				},
				expectedResult:
					"0200000000000F4240060000000000000011245B305D2E726573756C742E76616C7565",
			},
		] as const)("should encode a valid filter", ({ input, expectedResult }) => {
			const result = encodeConsensusFilter({
				method: "mad",
				...input,
			});

			const resultAsHex = Buffer.from(result).toString("hex").toUpperCase();

			expect(resultAsHex).toBe(expectedResult);
		});

		it("should fail on an invalid JSON path", () => {
			expect(() => {
				encodeConsensusFilter({
					method: "mad",
					// @ts-expect-error Force invalid input
					jsonPath: "result.text",
					maxSigma: 1.5,
					numberType: "int32",
				});
			}).toThrowError();
		});
	});
});
