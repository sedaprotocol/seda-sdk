import { describe, expect, it, setDefaultTimeout } from "bun:test";
import { testOracleProgramExecution, testOracleProgramTally } from "@seda/dev-tools";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { callVm, TallyVmAdapter } from "@seda-protocol/vm";

const tallyProgram = await readFile(
    resolve(
        import.meta.dir,
        "../../tally.wasm",
    ),
);

describe("metering", () => {
    setDefaultTimeout(30_000);

    it("should run out of gas when there is not enough gas attached to it", async () => {
        const result = await testOracleProgramExecution(
            tallyProgram,
            Buffer.from("not_used"),
            undefined,
            20n,
        );

        expect(result.exitCode).toBe(1);
        expect(result.stderr).toBe("Error: Ran out of gas");
        expect(result.gasUsed).toBe(5000000220000n);
    });

    it("should have the same amount of gas as the seda wasm vm", async () => {
        const result = await callVm({
            args: [Buffer.from("input_here").toString('hex'), '[]', '[]'],
            binary: tallyProgram,
            envs: {
                "CONSENSUS": "true",
                "VM_MODE": "tally",
                "DR_TALLY_GAS_LIMIT": "150000000000000",
            },
        }, undefined, new TallyVmAdapter());

        // const result = await testOracleProgramTally(
        //     tallyProgram,
        //     Buffer.from("not_used"),
        //     [],
        //     150000000000000n,
        // );

        console.log('[DEBUG]: result ::: ', result);

        expect(result.exitCode).toBe(0);
        expect(result.gasUsed).toBe(5020479841875n);
    });
});
