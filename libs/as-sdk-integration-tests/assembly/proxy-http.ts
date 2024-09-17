import {
	Bytes,
	OracleProgram,
	Process,
	generateProxyHttpSigningMessage,
	proxyHttpFetch,
} from "../../as-sdk/assembly";

export class TestProxyHttpFetch extends OracleProgram {
	execution(): void {
		const response = proxyHttpFetch("http://localhost:5384/proxy/planets/1");

		if (response.ok) {
			Process.success(response.bytes);
		}

		Process.error(response.bytes);
	}
}

export class TestGenerateProxyMessage extends OracleProgram {
	execution(): void {
		const message = generateProxyHttpSigningMessage(
			"https://example.com",
			"get",
			Bytes.empty(),
			Bytes.fromUtf8String(`{"name":"data-proxy"}`),
		);

		Process.success(Bytes.fromUtf8String(message.toHexString()));
	}
}
