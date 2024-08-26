import { Process, proxyHttpFetch } from "../../as-sdk/assembly";


export function testProxyHttpFetch(): void {
    const response = proxyHttpFetch('http://localhost:5384/proxy/planets/1');
    const fulfilledResponse = response.fulfilled;
    const rejectedResponse = response.rejected;

    if (fulfilledResponse) {
        const result = String.UTF8.decode(fulfilledResponse.bytes.value.buffer);

        Process.exit_with_message(0, result);
    }

    if (rejectedResponse) {
        const result = String.UTF8.decode(rejectedResponse.bytes.value.buffer);

        Process.exit_with_message(1, result);
    }

    Process.exit_with_message(20, "Something went wrong..");
}