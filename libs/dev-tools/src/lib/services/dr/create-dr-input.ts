import {
	type ConsensusFilter,
	encodeConsensusFilter,
} from "./consensus-filter";

const DEFAULT_VERSION = "0.0.1";
const DEFAULT_REPLICATION_FACTOR = 1;
const DEFAULT_EXEC_GAS_LIMIT = 300_000_000_000_000;
const DEFAULT_TALLY_GAS_LIMIT = 50_000_000_000_000;
const DEFAULT_GAS_PRICE = 2_000n;
const DEFAULT_MEMO = new Uint8Array([]);

export type PostDataRequestInput = {
	version?: string;

	/**
	 * Hash of the uploaded Oracle Program that should run the execution phase.
	 */
	execProgramId: string;
	/**
	 * Execution phase inputs encoded as bytes. Input depends on the Oracle Program specified in execProgramId.
	 */
	execInputs: Uint8Array;
	/**
	 * Amount of gas units allowed for execution across all overlay nodes
	 * Defaults to 300_000_000_000_000 (max gas limit per overlay node)
	 */
	execGasLimit?: number;

	/**
	 * Hash of the uploaded Tally Oracle Program that should run the tally phase.
	 * Defaults to the value of execProgramId.
	 */
	tallyProgramId?: string;
	/**
	 * Inputs encoded in bytes. Input depends on the Tally Oracle Program specified in tallyProgramId.
	 */
	tallyInputs: Uint8Array;
	/**
	 * Amount of gas units allowed for tally
	 * Defaults to 50_000_000_000_000 (max gas limit)
	 */
	tallyGasLimit?: number;

	/**
	 * Amount of overlay nodes required to execute this Data Request
	 * Defaults to 1
	 */
	replicationFactor?: number;

	/**
	 * Filter to apply to determine consenus among the data request reveals.
	 * method 'none': all results are valid.
	 * method 'mode': the most frequently occuring value (minimum 2/3rds of the data points).
	 */
	consensusOptions: ConsensusFilter;

	/**
	 * How much aseda you want to pay per gas unit
	 * Defaults to 2_000n (bigint)
	 */
	gasPrice?: bigint;

	/**
	 * Memo field for any data you want to attach to the Data Request
	 * Will also be returned to the destination chain
	 */
	memo?: Uint8Array;
};

export type DataRequest = ReturnType<typeof createPostedDataRequest>;

export function createPostedDataRequest(input: PostDataRequestInput) {
	const version = input.version ?? DEFAULT_VERSION;

	const exec_program_id = input.execProgramId;
	const exec_inputs = base64Encode(input.execInputs);

	const tally_program_id = input.tallyProgramId ?? input.execProgramId;
	const tally_inputs = base64Encode(input.tallyInputs);

	const replication_factor =
		input.replicationFactor ?? DEFAULT_REPLICATION_FACTOR;

	const consensus_filter = base64Encode(
		encodeConsensusFilter(input.consensusOptions),
	);

	const exec_gas_limit = input.execGasLimit ?? DEFAULT_EXEC_GAS_LIMIT;
	const tally_gas_limit = input.tallyGasLimit ?? DEFAULT_TALLY_GAS_LIMIT;
	const gas_price = (input.gasPrice ?? DEFAULT_GAS_PRICE).toString();

	const memo = base64Encode(input.memo ?? DEFAULT_MEMO);

	return {
		version,
		exec_program_id,
		exec_inputs,
		tally_program_id,
		tally_inputs,
		replication_factor,
		consensus_filter,
		exec_gas_limit,
		tally_gas_limit,
		gas_price,
		memo,
	};
}

function base64Encode(value: Uint8Array): string {
	return Buffer.from(value).toString("base64");
}
