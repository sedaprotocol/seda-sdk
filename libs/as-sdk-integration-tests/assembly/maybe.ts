import { Bytes, Maybe, OracleProgram, Process } from "../../as-sdk/assembly";

function someWrapper(returnJust: bool): Maybe<string> {
	if (returnJust) {
		return Maybe.just("value");
	}

	return Maybe.nothing<string>();
}

export class TestMaybeUsage extends OracleProgram {
	execution(): void {
		// Test Just value
		const justValue = someWrapper(true);

		if (!justValue.isJust()) {
			Process.error(Bytes.fromUtf8String("Maybe<T> was not Just"));
		}

		// Test Nothing value
		const nothingValue = someWrapper(false);

		if (!nothingValue.isNothing()) {
			Process.error(Bytes.fromUtf8String("Maybe<T> was not Nothing"));
		}

		// Test opposite conditions
		if (justValue.isNothing() || nothingValue.isJust()) {
			Process.error(
				Bytes.fromUtf8String("Maybe<T> is not what the value should be"),
			);
		}

		// Test unwrapOr
		const defaultValue = "default";
		if (nothingValue.unwrapOr(defaultValue) !== defaultValue) {
			Process.error(
				Bytes.fromUtf8String("Maybe<T> unwrapOr did not return default value"),
			);
		}

		if (justValue.unwrapOr(defaultValue) !== "value") {
			Process.error(
				Bytes.fromUtf8String("Maybe<T> unwrapOr did not return Just value"),
			);
		}

		Process.success(Bytes.empty());
	}
}
