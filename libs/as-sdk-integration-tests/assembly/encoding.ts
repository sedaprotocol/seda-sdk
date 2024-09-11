import {
	Bytes,
	OracleProgram,
	Process,
	encodeHex,
} from "../../as-sdk/assembly";

export class TestHexInputEncodeDecode extends OracleProgram {
	execution(): void {
		// Process.getInputs takes care of decoding the hex input
		const rawBytes = Process.getInputs().value;

		const hexString = encodeHex(rawBytes);

		Process.success(Bytes.fromUtf8String(hexString));
	}
}

export class TestBytesHexEncodeDecode extends OracleProgram {
	execution(): void {
		const input = Bytes.fromHexString(
			"006e75ec00000000000000000000000000000000000000000000",
		);

		Process.success(Bytes.fromUtf8String(input.toHexString()));
	}
}

export class TestBytesPrefixedHexDecode extends OracleProgram {
	execution(): void {
		const input = Bytes.fromHexString(
			"0x006e75ec00000000000000000000000000000000000000000000",
		);

		Process.success(Bytes.fromUtf8String(input.toHexString()));
	}
}
