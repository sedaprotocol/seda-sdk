import { describe, expect, it, setDefaultTimeout } from "bun:test";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { oracleProgram } from "./oracle-program";

describe("rs-sdk:infinite-loop", () => {
    setDefaultTimeout(30_000);

    it("should be able to get the current time", async () => {
        const result = await testOracleProgramExecution(
            oracleProgram,
            Buffer.from("testClockTimeGet"),
            undefined,
            300_000_000_000_000n,
        );

        expect(result.exitCode).toBe(0);
        expect(result.resultAsString).toInclude("The time is");
    });
});
