import {
	Bytes,
	OracleProgram,
	Process,
	decodeHex,
	keccak256,
	secp256k1Verify,
} from "../../as-sdk/assembly";

export class TestSecp256k1VerifyValid extends OracleProgram {
	execution(): void {
		const message = Bytes.fromUtf8String("Hello, SEDA!");
		const signature = Bytes.fromByteArray(
			decodeHex(
				"58376cc76f4d4959b0adf8070ecf0079db889915a75370f6e39a8451ba5be0c35f091fa4d2fda3ced5b6e6acd1dbb4a45f2c6a1e643622ee4cf8b802b373d38f",
			),
		);
		const publicKey = Bytes.fromByteArray(
			decodeHex(
				"02a2bebd272aa28e410cc74cef28e5ce74a9ffc94caf817ed9bd23b01ce2068c7b",
			),
		);
		const isValidSignature = secp256k1Verify(message, signature, publicKey);

		if (isValidSignature) {
			Process.success(Bytes.fromUtf8String("valid secp256k1 signature"));
		} else {
			Process.error(Bytes.fromUtf8String("invalid secp256k1 signature"));
		}
	}
}

export class TestSecp256k1VerifyInvalid extends OracleProgram {
	execution(): void {
		const message = Bytes.fromUtf8String("Hello, this is an invalid message!");
		const signature = Bytes.fromByteArray(
			decodeHex(
				"58376cc76f4d4959b0adf8070ecf0079db889915a75370f6e39a8451ba5be0c35f091fa4d2fda3ced5b6e6acd1dbb4a45f2c6a1e643622ee4cf8b802b373d38f",
			),
		);
		const publicKey = Bytes.fromByteArray(
			decodeHex(
				"02a2bebd272aa28e410cc74cef28e5ce74a9ffc94caf817ed9bd23b01ce2068c7b",
			),
		);
		const isValidSignature = secp256k1Verify(message, signature, publicKey);

		if (isValidSignature) {
			Process.success(Bytes.fromUtf8String("valid secp256k1 signature"));
		} else {
			Process.error(Bytes.fromUtf8String("invalid secp256k1 signature"));
		}
	}
}

export class TestKeccak256 extends OracleProgram {
	execution(): void {
		const message = Process.getInputs();

		const result = keccak256(message);

		Process.success(Bytes.fromUtf8String(result.toHexString()));
	}
}
