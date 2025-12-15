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
			vmMode: "tally",
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
	sync?: boolean,
	adapterOptions?: {
		totalHttpTimeLimit?: number;
		clockTime?: number;
		envs?: Record<string, string>;
		lastResult?: {
			exitCode: number;
			result: Buffer;
			timestamp: number;
		};
	},
	mockProxyGasCost: bigint | undefined = undefined,
) {
	const optionalEnvVars: Record<string, string> = {};

	if (adapterOptions?.lastResult) {
		optionalEnvVars.LAST_RESULT =
			adapterOptions.lastResult.result.toString("hex");
		optionalEnvVars.LAST_RESULT_EXIT_CODE =
			adapterOptions.lastResult.exitCode.toString();
		optionalEnvVars.LAST_RESULT_TIMESTAMP =
			adapterOptions.lastResult.timestamp.toString();
	}

	return callVm(
		{
			args: [inputs.toString("hex")],
			envs: {
				CHAIN_ID: "seda-1-local",
				...optionalEnvVars,
				...adapterOptions?.envs,
			},
			binary: new Uint8Array(oracleProgram),
			gasLimit,
			vmMode: "exec",
		},
		undefined,
		new DataRequestVmAdapter({
			fetchMock,
			mockProxyGasCost,
			...adapterOptions,
		}),
		sync,
	);
}
