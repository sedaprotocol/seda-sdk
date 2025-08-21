import { describe, expect, it } from "bun:test";
import {
	TestDataProxy,
	testOracleProgramExecution,
	testOracleProgramTally,
} from "@seda/dev-tools";

import { oracleProgram } from "../rs-sdk/oracle-program";

const data_proxy = new TestDataProxy();

describe("proxy http fetch", () => {
	it("should verify correctly for get method", async () => {
		const testCase = {
			method: "Get",
			response: await data_proxy.createResponse(
				"http://test.com/get/1",
				"GET",
				200,
				Buffer.from(JSON.stringify({ number: 1 })),
			),
		};

		const result = await testOracleProgramTally(
			oracleProgram,
			Buffer.from("testProxyHttpFetchVerification"),
			[
				{
					exitCode: 0,
					gasUsed: 0,
					inConsensus: true,
					result: Buffer.from(JSON.stringify(testCase)),
				},
			],
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("verification succeeded");
	});

	it("should verify correctly for post method", async () => {
		const requestBody = Buffer.from(JSON.stringify({ hello: true }));
		const testCase = {
			method: "Post",
			response: await data_proxy.createResponse(
				"http://test.com/post",
				"POST",
				200,
				Buffer.from(JSON.stringify({ world: true })),
				requestBody,
			),
			request_body: Array.from(requestBody),
		};

		const result = await testOracleProgramTally(
			oracleProgram,
			Buffer.from("testProxyHttpFetchVerification"),
			[
				{
					exitCode: 0,
					gasUsed: 0,
					inConsensus: true,
					result: Buffer.from(JSON.stringify(testCase)),
				},
			],
		);

		if (result.exitCode !== 0) {
			console.debug("Failure message:", result.resultAsString);
		}

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("verification succeeded");
	});
});
