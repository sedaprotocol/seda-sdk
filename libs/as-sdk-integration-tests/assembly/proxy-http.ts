import { Bytes, Process, proxyHttpFetch } from "../../as-sdk/assembly";

export function testProxyHttpFetch(): void {
    const response = proxyHttpFetch('http://localhost:5384/proxy/planets/1');
    const fulfilledResponse = response.fulfilled;
    const rejectedResponse = response.rejected;

    if (fulfilledResponse) {
        const result = String.UTF8.decode(fulfilledResponse.bytes.value.buffer);

        Process.success(Bytes.fromString(result));
    }

    if (rejectedResponse) {
        const result = String.UTF8.decode(rejectedResponse.bytes.value.buffer);

        Process.error(Bytes.fromString(result));
    }

    Process.error(Bytes.fromString("Something went wrong.."), 20);
}
