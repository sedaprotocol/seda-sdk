import { Bytes, OracleProgram, Process, Result } from "../../as-sdk/assembly";

function someWrapper(returnOk: bool): Result<string> {
	if (returnOk) {
		return Result.ok("ok");
	}

	return Result.err<string>(new Error("string"));
}

export class TestResultUsage extends OracleProgram {
	execution(): void {
		const okValue = someWrapper(true);

		if (!okValue.isOk()) {
			Process.error(Bytes.fromUtf8String("Result<T> was not ok"));
		}

		const errValue = someWrapper(false);

		if (!errValue.isErr()) {
			Process.error(Bytes.fromUtf8String("Result<T> was not an error"));
		}

		if (errValue.isOk() || okValue.isErr()) {
			Process.error(
				Bytes.fromUtf8String("Result<T> is not what the value should be"),
			);
		}

		Process.success(Bytes.empty());
	}
}
