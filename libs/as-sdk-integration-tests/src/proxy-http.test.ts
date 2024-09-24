import { beforeEach, describe, expect, it, mock } from "bun:test";
import { readFile } from "node:fs/promises";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { Response } from "node-fetch";

const mockHttpFetch = mock();

const oracleProgram = await readFile(
	"dist/libs/as-sdk-integration-tests/debug.wasm",
);

describe("ProxyHttp", () => {
	beforeEach(() => {
		mockHttpFetch.mockReset();
	});

	it.skip("should allow proxy_http_fetch which have a valid signature", async () => {
		const mockResponse = new Response('"Tatooine"', {
			headers: {
				"x-seda-signature":
					"93c67407c95f7d8252d8a28f5a637d57f2088376fcf34751d3ca04324e74d8185d11fe3fb23532f610158393b5678aeda82a56898fa95e0ca4d483e7aa472715",
				"x-seda-publickey":
					"02100efce2a783cc7a3fbf9c5d15d4cc6e263337651312f21a35d30c16cb38f4c3",
			},
		});

		mockHttpFetch.mockResolvedValue(mockResponse);

		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testProxyHttpFetch"),
			mockHttpFetch,
		);

		expect(result.exitCode).toBe(0);
		expect(result.result).toEqual(new TextEncoder().encode('"Tatooine"'));
	});

	it.skip("should reject if the proxy_http_fetch has an invalid signature", async () => {
		const mockResponse = new Response('"Tatooine"', {
			statusText: "mock_ok",
			headers: {
				"x-seda-signature":
					"83c67407c95f7d8252d8a28f5a637d57f2088376fcf34751d3ca04324e74d8185d11fe3fb23532f610158393b5678aeda82a56898fa95e0ca4d483e7aa472715",
				"x-seda-publickey":
					"02100efce2a783cc7a3fbf9c5d15d4cc6e263337651312f21a35d30c16cb38f4c3",
			},
		});

		mockHttpFetch.mockResolvedValue(mockResponse);

		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testProxyHttpFetch"),
			mockHttpFetch,
		);

		expect(result.exitCode).toBe(1);
		expect(result.result).toEqual(
			new TextEncoder().encode("Invalid signature"),
		);
	});
});

describe("generateProxyHttpSigningMessage", () => {
	it("should generate the expected message", async () => {
		const result = await testOracleProgramExecution(
			oracleProgram,
			Buffer.from("testGenerateProxyMessage"),
		);

		expect(result.resultAsString).toBe(
			"edba3f8cfcd4165f73cd4641ced2b2ec0d3ba4338e3eec30edd58777d86b53b25a61babeb76c554783ca90a1a250e84f1b703409fdff33c217ab64dd51f05199c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4706db57ed7cc68d9897b06df02ed002ce206633eec05690d504d61789ae87db019",
		);
	});
});
