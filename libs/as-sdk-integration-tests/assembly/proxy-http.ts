import { OracleProgram, Process, proxyHttpFetch } from "../../as-sdk/assembly";

export class TestProxyHttpFetch extends OracleProgram {
	execution(): void {
		const response = proxyHttpFetch("http://localhost:5384/proxy/planets/1");

		if (response.ok) {
			Process.success(response.bytes);
		}

		Process.error(response.bytes);
	}
}
