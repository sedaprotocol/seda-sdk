import { Bytes, OracleProgram, Process } from "../../as-sdk/assembly";

@json
class InvalidAttribute {
	value!: string;
}

export class TestInvalidAttribute extends OracleProgram {
	execution(): void {
		const result =
			Bytes.fromUtf8String(`{"value":0}`).toJSON<InvalidAttribute>();

		Process.success(Bytes.fromJSON(result));
	}
}
