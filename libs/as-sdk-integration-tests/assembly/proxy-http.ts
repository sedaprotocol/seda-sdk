import {
	Bytes,
	OracleProgram,
	Process,
	proxyHttpFetch,
} from "../../as-sdk/assembly";

export class TestProxyHttpFetch extends OracleProgram {
	execution(): void {
		const response = proxyHttpFetch("http://localhost:5384/proxy/planets/1");

		if (response.isFulfilled()) {
			Process.success(response.unwrap().bytes);
		}

		if (response.isRejected()) {
			Process.error(response.unwrapRejected().bytes);
		}

		Process.error(Bytes.fromString("Something went wrong.."), 20);
	}
}
