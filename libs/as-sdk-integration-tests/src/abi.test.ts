import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { testOracleProgramExecution } from "@seda/dev-tools";

const oracleProgram = await readFile(
    "dist/libs/as-sdk-integration-tests/debug.wasm",
);

describe("abi", () => {
    describe("abiDecode", () => {
        it.only("should be able to decode an abi encoded bytes string", async () => {
            const result = await testOracleProgramExecution(
                oracleProgram,
                Buffer.from(`testAbiDecode`),
            );

            expect(result.exitCode).toBe(0);
        });
    });
});