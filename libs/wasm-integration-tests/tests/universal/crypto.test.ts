import { describe, expect, it } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { sdks } from "./sdks";

describe.each(sdks)("%s:Crypto", (_, oracleProgram) => {
	it("Test valid Secp256k1 signature", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testSecp256k1VerifyValid"),
		);

		expect(result.resultAsString).toEqual("valid secp256k1 signature");
	});

	it("Test invalid Secp256k1 signature", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testSecp256k1VerifyInvalid"),
		);

		expect(result.exitCode).toBe(1);
		expect(result.resultAsString).toContain("invalid secp256k1 signature");
	});

	describe("keccak256", () => {
		it("should hash the input bytes correctly", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testKeccak256"),
			);

			expect(result.resultAsString).toEqual(
				"fe8baa653979909c621153b53c973bab3832768b5e77896a5b5944d20d48c7a6",
			);
		});
	});
});
