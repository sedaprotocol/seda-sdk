import {
	DataRequestVmAdapter,
	TallyVmAdapter,
	callVm,
} from "@seda-protocol/vm";
import type fetch from "node-fetch";
import { createMockTallyArgs } from "./create-mock-tally-args";

type TallyArgs = Parameters<typeof createMockTallyArgs>;

export function testOracleProgramTally(
	oracleProgram: Buffer,
	tallyInputs: TallyArgs[0],
	reports: TallyArgs[1],
	gasLimit?: bigint,
) {
	const args = createMockTallyArgs(tallyInputs, reports);

	return callVm(
		{
			args,
			envs: {},
			binary: new Uint8Array(oracleProgram),
			gasLimit,
		},
		undefined,
		new TallyVmAdapter(),
	);
}

export function testOracleProgramExecution(
	oracleProgram: Buffer,
	inputs: Buffer,
	fetchMock?: typeof fetch,
	gasLimit?: bigint,
) {
	return callVm(
		{
			args: [inputs.toString("hex")],
			envs: {},
			binary: new Uint8Array(oracleProgram),
			gasLimit,
		},
		undefined,
		new DataRequestVmAdapter({ fetchMock }),
	);
}
