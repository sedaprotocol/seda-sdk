import { describe, expect, it } from "bun:test";
import { secp256k1Verify } from "./crypto";

describe("Crypto", () => {
	it("should Secp256k1 verify", async () => {
		const message = Buffer.from("Hello, SEDA!");
		const signature = Buffer.from(
			"58376cc76f4d4959b0adf8070ecf0079db889915a75370f6e39a8451ba5be0c35f091fa4d2fda3ced5b6e6acd1dbb4a45f2c6a1e643622ee4cf8b802b373d38f",
			"hex",
		);
		const publicKey = Buffer.from(
			"02a2bebd272aa28e410cc74cef28e5ce74a9ffc94caf817ed9bd23b01ce2068c7b",
			"hex",
		);
		const result = secp256k1Verify(message, signature, publicKey);

		// Check if the result is a Uint8Array and has the value [1]
		expect(result).toEqual(1);
	});
});
