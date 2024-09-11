import { call_result_write, secp256k1_verify } from "./bindings/seda_v1";
import { Bytes } from "./bytes";

export function secp256k1Verify(
	message: Bytes,
	signature: Bytes,
	publicKey: Bytes,
): bool {
	const messageBuffer = message.buffer;
	const messagePtr = changetype<usize>(messageBuffer);

	const signatureBuffer = signature.buffer;
	const signaturePtr = changetype<usize>(signatureBuffer);

	const publicKeyBuffer = publicKey.buffer;
	const publicKeyPtr = changetype<usize>(publicKeyBuffer);

	// Call secp256k1_verify and get the response length
	const responseLength = secp256k1_verify(
		messagePtr,
		messageBuffer.byteLength,
		signaturePtr,
		signatureBuffer.byteLength,
		publicKeyPtr,
		publicKeyBuffer.byteLength,
	);

	// Allocate an ArrayBuffer for the response
	const responseBuffer = new ArrayBuffer(responseLength);
	// Get the pointer to the response buffer
	const responseBufferPtr = changetype<usize>(responseBuffer);
	// Write the result to the allocated buffer
	call_result_write(responseBufferPtr, responseLength);
	// Convert the response buffer into a Uint8Array
	const responseArray = Uint8Array.wrap(responseBuffer);

	// Return true if the response is [1] (valid)
	return responseArray[0] === 1;
}
