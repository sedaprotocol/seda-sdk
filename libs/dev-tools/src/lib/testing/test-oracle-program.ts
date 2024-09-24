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
	...tallyArgs: TallyArgs
) {
	const args = createMockTallyArgs(...tallyArgs);

	return callVm(
		{
			args,
			envs: {},
			binary: new Uint8Array(oracleProgram),
		},
		undefined,
		new TallyVmAdapter(),
	);
}

export function testOracleProgramExecution(
	oracleProgram: Buffer,
	inputs: Buffer,
	fetchMock?: typeof fetch,
) {
	return callVm(
		{
			args: [inputs.toString("hex")],
			envs: {},
			binary: new Uint8Array(oracleProgram),
		},
		undefined,
		new DataRequestVmAdapter({ fetchMock }),
	);
}
