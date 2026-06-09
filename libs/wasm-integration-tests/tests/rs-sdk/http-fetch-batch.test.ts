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

describe("rs-sdk:http-fetch-batch", () => {
	setDefaultTimeout(30_000);

	beforeEach(() => {
		mockHttpFetch.mockReset();
	});

	it("should fetch multiple URLs in a single batch call", async () => {
		const mockResponse1 = new Response(
			JSON.stringify({ userId: 1, id: 1, title: "todo1", completed: false }),
		);
		const mockResponse2 = new Response(
			JSON.stringify({ userId: 1, id: 2, title: "todo2", completed: true }),
		);

		mockHttpFetch
			.mockResolvedValueOnce(mockResponse1)
			.mockResolvedValueOnce(mockResponse2);

		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testHttpFetchBatchSuccess"),
			mockHttpFetch,
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("200:200");
		expect(mockHttpFetch).toHaveBeenCalledTimes(2);
	});

	it("should handle partial failures in batch", async () => {
		const successResponse = new Response(
			JSON.stringify({ userId: 1, id: 1, title: "todo1", completed: false }),
		);
		const errorResponse = new Response("Internal Server Error", {
			status: 500,
		});

		mockHttpFetch
			.mockResolvedValueOnce(successResponse)
			.mockResolvedValueOnce(errorResponse);

		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testHttpFetchBatchPartialFailure"),
			mockHttpFetch,
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("true:false");
	});

	it("should pass correct options to each request", async () => {
		mockHttpFetch.mockImplementation((url: URL, init: RequestInit) => {
			const body = `method=${init.method},url=${url.toString()}`;
			return Promise.resolve(new Response(body));
		});

		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testHttpFetchBatchOptions"),
			mockHttpFetch,
		);

		expect(result.exitCode).toBe(0);

		const [firstBody, secondBody] = (result.resultAsString ?? "").split("|");
		expect(firstBody).toBe("method=GET,url=https://api.example.com/get");
		expect(secondBody).toBe("method=POST,url=https://api.example.com/post");

		// Verify the second call received the correct headers and body
		const secondCall = mockHttpFetch.mock.calls[1];
		const secondInit = secondCall[1];
		expect(secondInit.method).toBe("POST");
		expect(secondInit.headers["Content-Type"]).toBe("application/json");
		expect(secondInit.headers["X-Custom"]).toBe("batch-test");
		expect(Buffer.from(secondInit.body).toString()).toBe('{"key":"value"}');
	});
});
