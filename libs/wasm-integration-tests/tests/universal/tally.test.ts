import { describe, expect, it } from "bun:test";
import { TallyVmAdapter, callVm } from "@seda-protocol/vm";
import { createMockTallyArgs, testOracleProgramTally } from "@seda/dev-tools";
import { sdks } from "./sdks";

describe.each(sdks)("%s:Tally", (sdkType, oracleProgram) => {
	it("should fail when the reveals and consensus arrays are not the same length", async () => {
		const args = createMockTallyArgs(Buffer.from("testTallyVmReveals"), [
			{
				exitCode: 0,
				gasUsed: 200000,
				result: JSON.stringify({ data: "baby_shark" }),
				inConsensus: true,
			},
			{
				exitCode: 1,
				gasUsed: 1336,
				result: JSON.stringify({ data: "grandpa_shark" }),
				inConsensus: false,
			},
		]);
		// Override consensus array from the helper.
		args[2] = "[0]";
		const result = await callVm(
			{
				args,
				// @ts-expect-error This is correct but TS doesn't know that.
				binary: oracleProgram,
				envs: {},
			},
			undefined,
			new TallyVmAdapter(),
		);

		console.log(result.stdout);
		expect(result.resultAsString).toInclude(
			"Number of reveals (2) does not equal number of consensus reports (1).",
		);
		expect(result.exitCode).toBe(1);
	});

	it("should be able to parse the reveals and return the unfiltered reveals", async () => {
		const reports = [
			{
				exitCode: 0,
				gasUsed: 200000,
				result: JSON.stringify({ data: "baby_shark" }),
				inConsensus: true,
			},
			{
				exitCode: 1,
				gasUsed: 1336,
				result: JSON.stringify({ data: "grandpa_shark" }),
				inConsensus: true,
			},
			{
				exitCode: 0,
				gasUsed: 12,
				result: JSON.stringify({ data: "grandma_shark" }),
				inConsensus: false,
			},
		];

		const result = await testOracleProgramTally(
			oracleProgram,
			Buffer.from("testTallyVmReveals"),
			reports,
		);

		console.log(result.stdout);
		expect(result.exitCode).toBe(0);

		if (sdkType === "as-sdk") {
			expect(result.resultAsString).toBe(
				'[{"body":{"salt":{"type":"hex","value":"736564615f73646b"},"exitCode":0,"gasUsed":200000,"reveal":{"type":"hex","value":"7b2264617461223a22626162795f736861726b227d"}},"inConsensus":true},{"body":{"salt":{"type":"hex","value":"736564615f73646b"},"exitCode":1,"gasUsed":1336,"reveal":{"type":"hex","value":"7b2264617461223a226772616e6470615f736861726b227d"}},"inConsensus":true},{"body":{"salt":{"type":"hex","value":"736564615f73646b"},"exitCode":0,"gasUsed":12,"reveal":{"type":"hex","value":"7b2264617461223a226772616e646d615f736861726b227d"}},"inConsensus":false}]',
			);
		} else if (sdkType === "rs-sdk" || sdkType === "go-sdk") {
			expect(result.resultAsString).toBe(
				'[{"body":{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":200000,"reveal":[123,34,100,97,116,97,34,58,34,98,97,98,121,95,115,104,97,114,107,34,125]},"in_consensus":true},{"body":{"salt":[115,101,100,97,95,115,100,107],"exit_code":1,"gas_used":1336,"reveal":[123,34,100,97,116,97,34,58,34,103,114,97,110,100,112,97,95,115,104,97,114,107,34,125]},"in_consensus":true},{"body":{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":12,"reveal":[123,34,100,97,116,97,34,58,34,103,114,97,110,100,109,97,95,115,104,97,114,107,34,125]},"in_consensus":false}]',
			);
		} else {
			expect.unreachable("Invalid sdk type");
		}
	});

	it("should provide a convenience method to filter out outliers.", async () => {
		const reports = [
			{
				exitCode: 1,
				gasUsed: 200000,
				result: JSON.stringify({ data: "baby_shark" }),
				inConsensus: false,
			},
			{
				exitCode: 0,
				gasUsed: 1336,
				result: JSON.stringify({ data: "grandpa_shark" }),
				inConsensus: true,
			},
			{
				exitCode: 0,
				gasUsed: 1346,
				result: JSON.stringify({ data: "cousin_shark" }),
				inConsensus: true,
			},
		];

		const result = await testOracleProgramTally(
			oracleProgram,
			Buffer.from("testTallyVmRevealsFiltered"),
			reports,
		);

		expect(result.exitCode).toBe(0);
		if (sdkType === "as-sdk") {
			expect(result.resultAsString).toBe(
				'[{"body":{"salt":{"type":"hex","value":"736564615f73646b"},"exitCode":0,"gasUsed":1336,"reveal":{"type":"hex","value":"7b2264617461223a226772616e6470615f736861726b227d"}},"inConsensus":true},{"body":{"salt":{"type":"hex","value":"736564615f73646b"},"exitCode":0,"gasUsed":1346,"reveal":{"type":"hex","value":"7b2264617461223a22636f7573696e5f736861726b227d"}},"inConsensus":true}]',
			);
		} else if (sdkType === "rs-sdk" || sdkType === "go-sdk") {
			expect(result.resultAsString).toBe(
				'[{"body":{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":1336,"reveal":[123,34,100,97,116,97,34,58,34,103,114,97,110,100,112,97,95,115,104,97,114,107,34,125]},"in_consensus":true},{"body":{"salt":[115,101,100,97,95,115,100,107],"exit_code":0,"gas_used":1346,"reveal":[123,34,100,97,116,97,34,58,34,99,111,117,115,105,110,95,115,104,97,114,107,34,125]},"in_consensus":true}]',
			);
		} else {
			expect.unreachable("Invalid sdk type");
		}
	});
});
