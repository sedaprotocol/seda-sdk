import assert from "node:assert";
import type { DrConfig } from "../get-dr-config";
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

const defaultDrConfig: DrConfig = {
	dr_reveal_size_limit_in_bytes: 24_000,
	exec_input_limit_in_bytes: 2_048,
	tally_input_limit_in_bytes: 512,
	consensus_filter_limit_in_bytes: 512,
	memo_limit_in_bytes: 512,
	payback_address_limit_in_bytes: 128,
	seda_payload_limit_in_bytes: 512,
};

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
	 * Will also be returned to the destination chain.
	 */
	memo?: Uint8Array;
};

export type DataRequest = ReturnType<typeof createPostedDataRequest>;

/**
 * Creates a Data Request object that can be posted to the Data Request API.
 *
 * @param input - The input object containing the Data Request details.
 * @param drConfig - The Data Request configuration on the contract. Defaults to the default values.
 * @returns The Data Request object as the contract expects it.
 */
export function createPostedDataRequest(
	input: PostDataRequestInput,
	drConfig = defaultDrConfig,
) {
	const version = input.version ?? DEFAULT_VERSION;

	const exec_program_id = input.execProgramId;
	assert(
		isHexAddress(exec_program_id),
		"execProgramId must be a valid hex of 64 characters",
	);

	assert(
		input.execInputs.length <= drConfig.exec_input_limit_in_bytes,
		`execInputs must be less than ${drConfig.exec_input_limit_in_bytes + 1} bytes, received ${input.execInputs.length}`,
	);
	const exec_inputs = base64Encode(input.execInputs);

	const tally_program_id = input.tallyProgramId ?? input.execProgramId;
	assert(
		isHexAddress(tally_program_id),
		"tallyProgramId must be a valid hex of 64 characters",
	);

	assert(
		input.tallyInputs.length <= drConfig.tally_input_limit_in_bytes,
		`tallyInputs must be less than ${drConfig.tally_input_limit_in_bytes + 1} bytes, received ${input.tallyInputs.length}`,
	);
	const tally_inputs = base64Encode(input.tallyInputs);

	const replication_factor =
		input.replicationFactor ?? DEFAULT_REPLICATION_FACTOR;

	const consensFilterBytes = encodeConsensusFilter(input.consensusOptions);
	assert(
		consensFilterBytes.length <= drConfig.consensus_filter_limit_in_bytes,
		`consensus_filter must be less than ${drConfig.consensus_filter_limit_in_bytes + 1} bytes, received ${consensFilterBytes.length}`,
	);
	const consensus_filter = base64Encode(consensFilterBytes);

	const exec_gas_limit = input.execGasLimit ?? DEFAULT_EXEC_GAS_LIMIT;
	const tally_gas_limit = input.tallyGasLimit ?? DEFAULT_TALLY_GAS_LIMIT;
	const gas_price = (input.gasPrice ?? DEFAULT_GAS_PRICE).toString();

	if (input.memo) {
		assert(
			input.memo.length <= drConfig.memo_limit_in_bytes,
			`memo must be less than ${drConfig.memo_limit_in_bytes + 1} bytes, received ${input.memo.length}`,
		);
	}
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

function isHexAddress(address: string): boolean {
	return !!address.match(/^[0-9a-fA-F]{64}$/);
}
