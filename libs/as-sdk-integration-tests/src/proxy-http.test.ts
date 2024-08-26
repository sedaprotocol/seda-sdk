import { expect, describe, it, mock, beforeEach } from 'bun:test';
import { executeDrWasm } from '@seda/dev-tools';
import { readFile } from 'node:fs/promises';
import { Response } from 'node-fetch';

const mockHttpFetch = mock();

describe('ProxyHttp', () => {
    beforeEach(() => {
        mockHttpFetch.mockReset();
    });

    it.skip('should allow proxy_http_fetch which have a valid signature', async () => {
        const wasmBinary = await readFile(
            'dist/libs/as-sdk-integration-tests/debug.wasm'
        );

        const mockResponse = new Response('"Tatooine"', { 
            headers: {
                'x-seda-signature': '93c67407c95f7d8252d8a28f5a637d57f2088376fcf34751d3ca04324e74d8185d11fe3fb23532f610158393b5678aeda82a56898fa95e0ca4d483e7aa472715',
                'x-seda-publickey': '02100efce2a783cc7a3fbf9c5d15d4cc6e263337651312f21a35d30c16cb38f4c3'
            },
        });

        mockHttpFetch.mockResolvedValue(mockResponse);

        const result = await executeDrWasm(
            wasmBinary,
            Buffer.from('testProxyHttpFetch'),
            mockHttpFetch
        );

        expect(result.exitCode).toBe(0);
        expect(result.result).toEqual(new TextEncoder().encode('"Tatooine"'));
    });

    it.skip('should reject if the proxy_http_fetch has an invalid signature', async () => {
        const wasmBinary = await readFile(
            'dist/libs/as-sdk-integration-tests/debug.wasm'
        );

        const mockResponse = new Response('"Tatooine"', {
            statusText: 'mock_ok',
            headers: {
                'x-seda-signature': '83c67407c95f7d8252d8a28f5a637d57f2088376fcf34751d3ca04324e74d8185d11fe3fb23532f610158393b5678aeda82a56898fa95e0ca4d483e7aa472715',
                'x-seda-publickey': '02100efce2a783cc7a3fbf9c5d15d4cc6e263337651312f21a35d30c16cb38f4c3'
            },
        });

        mockHttpFetch.mockResolvedValue(mockResponse);

        const result = await executeDrWasm(
            wasmBinary,
            Buffer.from('testProxyHttpFetch'),
            mockHttpFetch
        );

        expect(result.exitCode).toBe(1);
        expect(result.result).toEqual(new TextEncoder().encode('Invalid signature'));
    });
});
