import { Bytes, Console, OracleProgram, Process } from "../../as-sdk/assembly";

export class TestBytesSliceNoArguments extends OracleProgram {
	execution(): void {
		const input = Process.getInputs();

		const copy = input.slice();
		copy.value.fill(0);
		Console.log(copy.toUtf8String());

		Process.success(input);
	}
}

export class TestBytesSliceOnlyStart extends OracleProgram {
	execution(): void {
		const input = Process.getInputs();

		const copy = input.slice(14);

		Process.success(copy);
	}
}

export class TestBytesSliceStartEnd extends OracleProgram {
	execution(): void {
		const input = Process.getInputs();

		const copy = input.slice(9, 14);

		Process.success(copy);
	}
}
