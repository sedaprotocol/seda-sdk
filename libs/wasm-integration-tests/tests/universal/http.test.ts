import { beforeEach, describe, expect, it, mock } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { Response } from "node-fetch";
import { sdks } from "./sdks";

const mockHttpFetch = mock();

describe.each(sdks)("%s:Http", (_, oracleProgram) => {
	beforeEach(() => {
		mockHttpFetch.mockReset();
	});

	it("Test mocked SDK HTTP Success in a sync environment", async () => {
		const mockResponse = new Response(
			JSON.stringify({
				userId: 200,
				id: 999,
				title: "mocked",
				completed: true,
			}),
		);
		mockHttpFetch.mockResolvedValue(mockResponse);

		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testHttpSuccess"),
			mockHttpFetch,
			undefined,
			true,
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toEqual("200:999:mocked:true");
	});

	it("Test SDK HTTP Rejection", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testHttpRejection"),
			mockHttpFetch,
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toEqual("rejected");
	});

	it("Test mocked SDK HTTP Success", async () => {
		const mockResponse = new Response(
			JSON.stringify({
				userId: 200,
				id: 999,
				title: "mocked",
				completed: true,
			}),
		);
		mockHttpFetch.mockResolvedValue(mockResponse);

		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testHttpSuccess"),
			mockHttpFetch,
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toEqual("200:999:mocked:true");
	});

	// Possibly flakey as it relies on internet connectivity and an external service
	it("Test SDK HTTP Success", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testHttpSuccess"),
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toEqual("1:1:delectus aut autem:false");
	});

	// Possibly flakey as it relies on internet connectivity and an external service
	it("Test SDK HTTP POST Success", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testPostHttpSuccess"),
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toEqual(
			"101:Test SDK:Don't forget to test some integrations.",
		);
	});
});
