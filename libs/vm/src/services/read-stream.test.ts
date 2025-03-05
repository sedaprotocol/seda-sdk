import { describe, expect, test } from "bun:test";
import { Readable } from "node:stream";
import { readStream } from "./read-stream";

describe("readStream", () => {
	describe("Web ReadableStream", () => {
		test("should read stream successfully", async () => {
			const response = await fetch("https://example.com");
			const stream = response.body;
			if (!stream) throw new Error("No stream received");

			const result = await readStream(stream);
			expect(result.isOk).toBe(true);

			if (result.isOk) {
				const content = result.value.toString();
				expect(content).toContain("<!doctype html>");
			}
		});

		test("should error when exceeding max bytes", async () => {
			const response = await fetch("https://example.com");
			const stream = response.body;
			if (!stream) throw new Error("No stream received");

			const maxBytes = 100; // Small limit to trigger error
			const result = await readStream(stream, maxBytes);

			expect(result.isErr).toBe(true);
			if (result.isErr) {
				expect(result.error.message).toBe(
					`Stream exceeded maximum size of ${maxBytes} bytes`,
				);
			}
		});

		test("should handle stream errors", async () => {
			const stream = new ReadableStream({
				start(controller) {
					controller.error(new Error("Stream error"));
				},
			});

			const result = await readStream(stream);
			expect(result.isErr).toBe(true);
		});
	});

	describe("Node.js ReadableStream", () => {
		test("should read stream successfully", async () => {
			const data = "Hello, World!";
			const stream = Readable.from(Buffer.from(data));

			const result = await readStream(stream);
			expect(result.isOk).toBe(true);

			if (result.isOk) {
				expect(result.value.toString()).toBe(data);
			}
		});

		test("should error when exceeding max bytes", async () => {
			const data = "Hello, World!";
			const stream = Readable.from(Buffer.from(data));

			const maxBytes = 5; // Smaller than the data
			const result = await readStream(stream, maxBytes);

			expect(result.isErr).toBe(true);

			if (result.isErr) {
				expect(result.error.message).toBe(
					`Stream exceeded maximum size of ${maxBytes} bytes`,
				);
			}
		});

		test("should handle stream errors", async () => {
			const stream = new Readable({
				read() {
					this.destroy(new Error("Stream error"));
				},
			});

			const result = await readStream(stream);
			expect(result.isErr).toBe(true);
		});
	});
});
