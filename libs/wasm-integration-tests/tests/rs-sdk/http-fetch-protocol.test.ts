import { describe, expect, it, setDefaultTimeout } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("rs-sdk:http-fetch-protocol", () => {
    it("should stop when a program is trying to access a file", async () => {
        const result = await testOracleProgramExecution(
            oracleProgram,
            Buffer.from("testHttpFetchAccessFile"),
            undefined,
            undefined,
        );

        expect(result.exitCode).toBe(0);
        expect(result.resultAsString).toInclude("is not http or https");
    });
});
