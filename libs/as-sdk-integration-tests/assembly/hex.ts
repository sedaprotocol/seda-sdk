import {
	Bytes,
	OracleProgram,
	Process,
	encodeHex,
} from "../../as-sdk/assembly";

export class TestHexEncodeDecode extends OracleProgram {
	execution(): void {
		// Process.getInputs takes care of decoding the hex input
		const rawBytes = Process.getInputs().value;

		const hexString = encodeHex(rawBytes);

		Process.success(Bytes.fromString(hexString));
	}
}
