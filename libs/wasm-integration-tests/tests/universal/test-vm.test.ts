import { describe, it, expect } from "bun:test";
import { TallyVmAdapter, callVm } from "@seda-protocol/vm";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const tallyProgram = readFileSync(resolve(import.meta.dir, "../../test-vm.wasm"));


describe("test-vm", () => {
    it("call_result_write_0", async () => {
        const result = await callVm(
            {
                args: [Buffer.from("call_result_write_0").toString("hex"), "[]", "[]"],
                binary: tallyProgram,
                envs: {
                    CONSENSUS: "true",
                    VM_MODE: "tally",
                    DR_TALLY_GAS_LIMIT: "150000000000000",
                },
            },
            undefined,
            new TallyVmAdapter(),
        );

        expect(result.stderr).toInclude("call_result_write: result_data_ptr length does not match call_value length");
    });

    it("cannot_spam_call_result_write", async () => {
        const result = await callVm(
            {
                args: [Buffer.from("cannot_spam_call_result_write").toString("hex"), "[]", "[]"],
                binary: tallyProgram,
                envs: {
                    CONSENSUS: "true",
                    VM_MODE: "tally",
                    DR_TALLY_GAS_LIMIT: "150000000000000",
                },
            },
            undefined,
            new TallyVmAdapter(),
        );

        expect(result.stderr).toInclude("call_result_write: result_data_ptr length does not match call_value length");
    });

    it("import_length_overflow", async () => {
        const result = await callVm(
            {
                args: [Buffer.from("import_length_overflow").toString("hex"), "[]", "[]"],
                binary: tallyProgram,
                envs: {
                    CONSENSUS: "true",
                    VM_MODE: "tally",
                    DR_TALLY_GAS_LIMIT: "50000000000000",
                },
                gasLimit: 50000000000000n
            },
            undefined,
            new TallyVmAdapter(),
        );

        expect(result.stderr).toInclude("Ran out of gas");
    });

    it("infinite_loop_wasi", async () => {
        const startTime = Date.now();
        const result = await callVm(
            {
                args: [Buffer.from("infinite_loop_wasi").toString("hex"), "[]", "[]"],
                binary: tallyProgram,
                envs: {
                    CONSENSUS: "true",
                    VM_MODE: "tally",
                    DR_TALLY_GAS_LIMIT: "50000000000000",
                },
                gasLimit: 50000000000000n
            },
            undefined,
            new TallyVmAdapter(),
            true,
        );

        const endTime = Date.now();
        const executionTime = endTime - startTime;

        expect(result.stderr).toInclude("Ran out of gas");
        expect(executionTime).toBeLessThan(1000); // Less than 1 second (1000ms)
    });

    it("long_stdout_stderr", async () => {
        const result = await callVm(
            {
                args: [Buffer.from("long_stdout_stderr").toString("hex"), "[]", "[]"],
                binary: tallyProgram,
                envs: {
                    CONSENSUS: "true",
                    VM_MODE: "tally",
                    DR_TALLY_GAS_LIMIT: "50000000000000",
                },
                gasLimit: 50000000000000n,
                stderrLimit: 1024,
                stdoutLimit: 1024,
            },
            undefined,
            new TallyVmAdapter(),
            true,
        );

        expect(result.stderr.length).toBe(1024);
        expect(result.stdout.length).toBe(1024);
    });

    it("price_feed_tally", async () => {
        const reveals = "[{\"salt\":[115,101,100,97,95,115,100,107],\"exit_code\":0,\"gas_used\":200,\"reveal\":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,50,125]},{\"salt\":[115,101,100,97,95,115,100,107],\"exit_code\":0,\"gas_used\":198,\"reveal\":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,52,53,125]},{\"salt\":[115,101,100,97,95,115,100,107],\"exit_code\":0,\"gas_used\":201,\"reveal\":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,50,56,125]},{\"salt\":[115,101,100,97,95,115,100,107],\"exit_code\":0,\"gas_used\":199,\"reveal\":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,55,125]},{\"salt\":[115,101,100,97,95,115,100,107],\"exit_code\":0,\"gas_used\":202,\"reveal\":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,48,125]},{\"salt\":[115,101,100,97,95,115,100,107],\"exit_code\":0,\"gas_used\":197,\"reveal\":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,52,49,125]},{\"salt\":[115,101,100,97,95,115,100,107],\"exit_code\":0,\"gas_used\":200,\"reveal\":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,53,125]},{\"salt\":[115,101,100,97,95,115,100,107],\"exit_code\":0,\"gas_used\":203,\"reveal\":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,57,125]},{\"salt\":[115,101,100,97,95,115,100,107],\"exit_code\":0,\"gas_used\":196,\"reveal\":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,51,125]},{\"salt\":[115,101,100,97,95,115,100,107],\"exit_code\":0,\"gas_used\":201,\"reveal\":[123,34,112,114,105,99,101,34,58,32,49,49,50,57,57,51,54,125]}]";
        const consensus = "[0,0,0,0,0,0,0,0,0,0]";
        const result = await callVm(
            {
                args: [Buffer.from("price_feed_tally").toString("hex"), reveals, consensus],
                binary: tallyProgram,
                envs: {
                    CONSENSUS: "true",
                    VM_MODE: "tally",
                    DR_TALLY_GAS_LIMIT: "50000000000000",
                },
                gasLimit: 50000000000000n,
                stderrLimit: 1024,
                stdoutLimit: 1024,
            },
            undefined,
            new TallyVmAdapter(),
            true,
        );
        
        expect(result.stdout).toBe("1129935\n");
    });

    it("stderr_non_utf8", async () => {
        const result = await callVm(
            {
                args: [Buffer.from("stderr_non_utf8").toString("hex")],
                binary: tallyProgram,
                envs: {
                    CONSENSUS: "true",
                    VM_MODE: "tally",
                    DR_TALLY_GAS_LIMIT: "50000000000000",
                },
                gasLimit: 50000000000000n,
                stderrLimit: 1024,
                stdoutLimit: 1024,
            },
            undefined,
            new TallyVmAdapter(),
            true,
        );

        expect(result.stderr).toInclude("stream did not contain valid UTF-8`");
    });

    it("stdout_non_utf8", async () => {
        const result = await callVm(
            {
                args: [Buffer.from("stdout_non_utf8").toString("hex")],
                binary: tallyProgram,
                envs: {
                    CONSENSUS: "true",
                    VM_MODE: "tally",
                    DR_TALLY_GAS_LIMIT: "50000000000000",
                },
                gasLimit: 50000000000000n,
                stderrLimit: 1024,
                stdoutLimit: 1024,
            },
            undefined,
            new TallyVmAdapter(),
            true,
        );

        expect(result.stderr).toInclude("stream did not contain valid UTF-8`");
    });
});