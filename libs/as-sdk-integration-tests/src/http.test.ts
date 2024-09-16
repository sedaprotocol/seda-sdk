import { beforeEach, describe, expect, it, mock } from "bun:test";
import { readFile } from "node:fs/promises";
import { executeDrWasm } from "@seda/dev-tools";
import { Response } from "node-fetch";

const mockHttpFetch = mock();

describe("Http", () => {
	beforeEach(() => {
		mockHttpFetch.mockReset();
	});

	it("Test SDK HTTP Rejection", async () => {
		const wasmBinary = await readFile(
			"dist/libs/as-sdk-integration-tests/debug.wasm",
		);

		const result = await executeDrWasm(
			wasmBinary,
			Buffer.from("testHttpRejection"),
			mockHttpFetch,
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toEqual("rejected");
	});

	it("Test mocked SDK HTTP Success", async () => {
		const wasmBinary = await readFile(
			"dist/libs/as-sdk-integration-tests/debug.wasm",
		);

		const mockResponse = new Response(
			JSON.stringify({
				userId: 200,
				id: 999,
				title: "mocked",
				completed: true,
			}),
		);
		mockHttpFetch.mockResolvedValue(mockResponse);

		const result = await executeDrWasm(
			wasmBinary,
			Buffer.from("testHttpSuccess"),
			mockHttpFetch,
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toEqual("200:999:mocked:true");
	});

	// Possibly flakey as it relies on internet connectivity and an external service
	it("Test SDK HTTP Success", async () => {
		const wasmBinary = await readFile(
			"dist/libs/as-sdk-integration-tests/debug.wasm",
		);
		const result = await executeDrWasm(
			wasmBinary,
			Buffer.from("testHttpSuccess"),
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toEqual("1:1:delectus aut autem:false");
	});

	// Possibly flakey as it relies on internet connectivity and an external service
	it("Test SDK HTTP POST Success", async () => {
		const wasmBinary = await readFile(
			"dist/libs/as-sdk-integration-tests/debug.wasm",
		);
		const result = await executeDrWasm(
			wasmBinary,
			Buffer.from("testPostHttpSuccess"),
		);

		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toEqual(
			"101:Test SDK:Don't forget to test some integrations.",
		);
	});

	it("should exit when an invalid WASM binary is given", async () => {
		const result = await executeDrWasm(
			Buffer.from(new Uint8Array([0, 97, 115, 109])),
			Buffer.from("testHttpSuccess"),
		);

		expect(result).toEqual({
			exitCode: 1,
			stderr:
				"CompileError: WebAssembly.Module doesn't parse at byte 0: expected a module of at least 8 bytes",
			stdout: "",
			result: new Uint8Array(),
			resultAsString: "",
		});
	});
});
