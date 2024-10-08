import {
	Bytes,
	OracleProgram,
	Process,
	httpFetch,
} from "../../as-sdk/assembly/index";

export class TestTallyVmMode extends OracleProgram {
	execution(): void {
		Process.error(Bytes.fromUtf8String("dr"));
	}

	tally(): void {
		Process.success(Bytes.fromUtf8String("tally"));
	}
}

export class TestTallyVmHttp extends OracleProgram {
	tally(): void {
		const response = httpFetch("https://swapi.dev/api/planets/1/");

		if (response.ok) {
			Process.error(
				Bytes.fromUtf8String("this should not be allowed in tally mode"),
			);
		}

		Process.success(response.bytes);
	}
}
