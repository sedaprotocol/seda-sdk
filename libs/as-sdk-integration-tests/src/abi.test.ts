import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { decodeAbiParameters, encodeAbiParameters } from "viem";

const oracleProgram = await readFile(
    "/Users/franklin/Workspace/SEDA/seda-sdk/dist/libs/as-sdk-integration-tests/debug.wasm",
);

describe("abi", () => {
    describe("abiDecode", () => {
        it.only("should be able to decode an abi encoded bytes string", async () => {
            const aa = encodeAbiParameters([
                { name: 'x', type: 'bytes' },
                { name: 'y', type: 'uint' },
                { name: 'z', type: 'bool' }
            ], ["0x86937222", 7n, false]);

            const result = await testOracleProgramExecution(
                oracleProgram,
                Buffer.from(`testAbiDecode:${aa}`),
            );


            const values = decodeAbiParameters(
                [
                    { name: 'x', type: 'string' },
                    { name: 'y', type: 'uint' },
                    { name: 'z', type: 'bool' }
                ],
                '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000',
            );

            console.log('[DEBUG]: values ::: ', values);

            console.log('[DEBUG]: result ::: ', result);

            expect(result.resultAsString).toBe("Hello, world!");
        });
    });
});