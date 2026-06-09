import {
	beforeEach,
	describe,
	expect,
	it,
	mock,
	setDefaultTimeout,
} from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { Response } from "node-fetch";
import { oracleProgram } from "./oracle-program";

const mockHttpFetch = mock();

describe("rs-sdk:proxy-http-fetch-batch", () => {
	setDefaultTimeout(30_000);

	beforeEach(() => {
		mockHttpFetch.mockReset();
	});

	it("should fetch multiple proxy URLs in a single batch call", async () => {
		const mockResponse1 = new Response(
			JSON.stringify({ source: "proxy1", value: 42 }),
		);
		const mockResponse2 = new Response(
			JSON.stringify({ source: "proxy2", value: 99 }),
		);

		mockHttpFetch
			.mockResolvedValueOnce(mockResponse1)
			.mockResolvedValueOnce(mockResponse2);

		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testProxyHttpFetchBatchSuccess"),
			mockHttpFetch,
			undefined,
			false,
			undefined,
			0n,
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("200:200");
		expect(mockHttpFetch).toHaveBeenCalledTimes(2);
	});

	it("should handle partial failures in proxy batch", async () => {
		const successResponse = new Response(
			JSON.stringify({ source: "proxy1", value: 42 }),
		);
		const errorResponse = new Response("Proxy Error", { status: 502 });

		mockHttpFetch
			.mockResolvedValueOnce(successResponse)
			.mockResolvedValueOnce(errorResponse);

		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testProxyHttpFetchBatchPartialFailure"),
			mockHttpFetch,
			undefined,
			false,
			undefined,
			0n,
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("true:false");
	});

	it("should pass correct options to each proxy request", async () => {
		mockHttpFetch.mockImplementation((url: URL, init: RequestInit) => {
			const body = `method=${init.method},url=${url.toString()}`;
			return Promise.resolve(new Response(body));
		});

		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testProxyHttpFetchBatchOptions"),
			mockHttpFetch,
			undefined,
			false,
			undefined,
			0n,
		);

		expect(result.exitCode).toBe(0);

		const [firstBody, secondBody] = (result.resultAsString ?? "").split("|");
		expect(firstBody).toBe("method=GET,url=https://proxy.example.com/get");
		expect(secondBody).toBe("method=POST,url=https://proxy.example.com/post");

		const secondCall = mockHttpFetch.mock.calls[1];
		const secondInit = secondCall[1];
		expect(secondInit.method).toBe("POST");
		expect(secondInit.headers["Content-Type"]).toBe("application/json");
		expect(secondInit.headers["X-Proxy-Custom"]).toBe("batch-proxy-test");
		expect(Buffer.from(secondInit.body).toString()).toBe('{"proxy":"data"}');
	});
});
