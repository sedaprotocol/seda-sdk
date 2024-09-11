import { Bytes, Console, OracleProgram, Process } from "../../as-sdk/assembly";

export class TestLogBuffer extends OracleProgram {
	execution(): void {
		const input = Bytes.fromUtf8String("buffer");

		Console.log(input.buffer);

		Process.exit(0);
	}
}

export class TestLogByteArray extends OracleProgram {
	execution(): void {
		const input = Bytes.fromUtf8String("TypedArray");

		Console.log(input.value);

		Process.exit(0);
	}
}
