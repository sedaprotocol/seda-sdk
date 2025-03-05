import { Result } from "true-myth";

type StreamType = ReadableStream | NodeJS.ReadableStream;

export async function readStream(
	stream: StreamType,
	maxBytes?: number,
): Promise<Result<Buffer, Error>> {
	const chunks: Uint8Array[] = [];
	let totalLength = 0;

	try {
		if (stream instanceof ReadableStream) {
			const reader = stream.getReader();

			while (true) {
				const { done, value } = await reader.read();

				if (done) break;

				if (value) {
					totalLength += value.byteLength;

					if (maxBytes && totalLength > maxBytes) {
						reader.cancel();
						return Result.err(
							new Error(`Stream exceeded maximum size of ${maxBytes} bytes`),
						);
					}

					chunks.push(value);
				}
			}
		} else {
			// Handle Node.js ReadableStream
			return new Promise((resolve) => {
				stream.on("data", (chunk: Buffer | Uint8Array) => {
					totalLength += chunk.length;

					if (maxBytes && totalLength > maxBytes) {
						// @ts-expect-error it does exists..
						stream.destroy();
						resolve(
							Result.err(
								new Error(`Stream exceeded maximum size of ${maxBytes} bytes`),
							),
						);
						return;
					}

					chunks.push(chunk);
				});

				stream.on("error", (error: Error) => {
					resolve(Result.err(error));
				});

				stream.on("end", () => {
					resolve(Result.ok(Buffer.concat(chunks)));
				});
			});
		}

		return Result.ok(Buffer.concat(chunks));
	} catch (error) {
		return Result.err(
			error instanceof Error ? error : new Error(String(error)),
		);
	}
}
