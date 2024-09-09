import { keccak_256 } from "@noble/hashes/sha3";
import * as Secp256k1 from "@noble/secp256k1";

export function keccak256(input: Buffer): Buffer {
	const hasher = keccak_256.create();
	hasher.update(input);

	return Buffer.from(hasher.digest());
}

export function secp256k1Verify(
	message: Buffer,
	signature: Buffer,
	publicKey: Buffer,
): Uint8Array {
	const signedMessage = keccak256(message);
	const isValidSignature = Secp256k1.verify(
		signature,
		signedMessage,
		publicKey,
	);

	// Return 1 as Uint8Array if valid, 0 if not
	return new Uint8Array([isValidSignature ? 1 : 0]);
}
