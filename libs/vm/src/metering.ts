import { VmError } from "./errors";

const GAS_MULTIPLIER_EXEC = 15n;
const GAS_MULTIPLIER_TALLY = 150n;
const GAS_PER_OPERATION_BASE = 125n;
const GAS_ACCOUNTING_MULTIPLIER = 3_000n;

const GAS_PER_OPERATION_TALLY = GAS_PER_OPERATION_BASE * GAS_MULTIPLIER_TALLY;
const GAS_PER_OPERATION_EXEC = GAS_PER_OPERATION_BASE * GAS_MULTIPLIER_EXEC;

const GAS_ACCOUNTING_OPCODE_TALLY =
	GAS_PER_OPERATION_TALLY * GAS_ACCOUNTING_MULTIPLIER;
const GAS_ACCOUNTING_OPCODE_EXEC =
	GAS_PER_OPERATION_EXEC * GAS_ACCOUNTING_MULTIPLIER;

// Gas for reading and writing bytes
const GAS_PER_BYTE = 10_000n;

const GAS_PER_BYTE_EXECUTION_RESULT = 10_000_000n;

const TERA_GAS = 1_000_000_000_000n;

// Makes it so you can do roughly 30 http requests with the current gas calculations.
const GAS_HTTP_FETCH_BASE = TERA_GAS * 5n;

const GAS_BN254_VERIFY_BASE = TERA_GAS;
// Makes it so you can do roughly 25 proxy http requests with the current gas calculations.
const GAS_PROXY_HTTP_FETCH_BASE = TERA_GAS * 7n;
const GAS_SECP256K1_BASE = TERA_GAS;
const GAS_KECCAK256_BASE = TERA_GAS;
const GAS_STARTUP = TERA_GAS * 5n;

// WASI Gas
const GAS_ARGS_GET_BASE = TERA_GAS;
const GAS_ARGS_SIZES_GET_BASE = TERA_GAS;
const GAS_ENVIRON_GET_BASE = TERA_GAS;
const GAS_ENVIRON_SIZES_GET_BASE = TERA_GAS;
const GAS_FD_WRITE_BASE = TERA_GAS;
const GAS_RANDOM_GET_BASE = TERA_GAS;
export enum CallType {
	ExecutionResult = 0,
	HttpFetchRequest = 1,
	HttpFetchResponse = 2,
	Bn254Verify = 3,
	ProxyHttpFetchRequest = 4,
	Secp256k1Verify = 5,
	Keccak256 = 6,
	Startup = 7,
	ArgsGet = 8,
	ArgsSizesGet = 9,
	EnvironGet = 10,
	EnvironSizesGet = 11,
	FdWrite = 12,
	RandomGet = 13,
}

export class GasMeter {
	public gasUsed: bigint;
	public limit: bigint;

	constructor(limit: bigint, startingGas = 0n) {
		this.limit = limit;
		this.gasUsed = startingGas;
	}

	useGas(gas: bigint) {
		this.gasUsed += gas;

		if (this.gasUsed > this.limit) {
			throw new VmError("Ran out of gas");
		}
	}

	applyGasCost(type: CallType, bytesLength: bigint) {
		let gasCost: bigint;

		switch (type) {
			case CallType.Startup:
				gasCost = GAS_STARTUP + GAS_PER_BYTE * bytesLength;
				break;
			case CallType.ExecutionResult:
				gasCost = GAS_PER_BYTE_EXECUTION_RESULT * bytesLength;
				break;
			case CallType.HttpFetchRequest:
				gasCost = GAS_HTTP_FETCH_BASE + GAS_PER_BYTE * bytesLength;
				break;
			case CallType.HttpFetchResponse:
				gasCost = GAS_PER_BYTE * bytesLength;
				break;
			case CallType.Bn254Verify:
				gasCost = GAS_BN254_VERIFY_BASE + GAS_PER_BYTE * bytesLength;
				break;
			case CallType.ProxyHttpFetchRequest:
				gasCost = GAS_PROXY_HTTP_FETCH_BASE + GAS_PER_BYTE * bytesLength;
				break;
			case CallType.Secp256k1Verify:
				gasCost =
					GAS_SECP256K1_BASE + GAS_KECCAK256_BASE + GAS_PER_BYTE * bytesLength;
				break;
			case CallType.Keccak256:
				gasCost = GAS_KECCAK256_BASE + GAS_PER_BYTE * bytesLength;
				break;
			case CallType.ArgsGet:
				gasCost = GAS_ARGS_GET_BASE + GAS_PER_BYTE * bytesLength;
				break;
			case CallType.ArgsSizesGet:
				gasCost = GAS_ARGS_SIZES_GET_BASE + GAS_PER_BYTE * bytesLength;
				break;
			case CallType.EnvironGet:
				gasCost = GAS_ENVIRON_GET_BASE + GAS_PER_BYTE * bytesLength;
				break;
			case CallType.EnvironSizesGet:
				gasCost = GAS_ENVIRON_SIZES_GET_BASE + GAS_PER_BYTE * bytesLength;
				break;
			case CallType.FdWrite:
				// For FdWrite, use the number of I/O vectors instead of bytes length
				// This aligns with the Rust implementation
				gasCost = GAS_FD_WRITE_BASE + GAS_PER_BYTE * bytesLength;
				break;
			case CallType.RandomGet:
				gasCost = GAS_RANDOM_GET_BASE + GAS_PER_BYTE * bytesLength;
				break;
			default:
				throw new VmError("Unknown call type");
		}

		this.useGas(gasCost);
	}
}

export const tallyCostTable = {
	memory: {
		maximum: 160,
	},
	type: {
		DEFAULT: Number(GAS_PER_OPERATION_TALLY),
	},
	code: {
		locals: {
			DEFAULT: Number(GAS_PER_OPERATION_TALLY),
		},
		code: {
			DEFAULT: Number(GAS_PER_OPERATION_TALLY),
			loop: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			end: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			if: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			else: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			br: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			br_table: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			br_if: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			call: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			call_indirect: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			return: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			throw: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			throw_ref: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			rethrow: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			delegate: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			catch: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			return_call: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			return_call_indirect: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			br_on_cast: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			br_on_cast_fail: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			call_ref: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			return_call_ref: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			br_on_null: Number(GAS_ACCOUNTING_OPCODE_TALLY),
			br_on_non_null: Number(GAS_ACCOUNTING_OPCODE_TALLY),
		},
	},
};

export const execCostTable = {
	memory: {
		maximum: 160,
	},
	type: {
		DEFAULT: Number(GAS_PER_OPERATION_EXEC),
	},
	code: {
		locals: {
			DEFAULT: Number(GAS_PER_OPERATION_EXEC),
		},
		code: {
			DEFAULT: Number(GAS_PER_OPERATION_EXEC),
			loop: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			end: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			if: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			else: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			br: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			br_table: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			br_if: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			call: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			call_indirect: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			return: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			throw: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			throw_ref: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			rethrow: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			delegate: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			catch: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			return_call: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			return_call_indirect: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			br_on_cast: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			br_on_cast_fail: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			call_ref: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			return_call_ref: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			br_on_null: Number(GAS_ACCOUNTING_OPCODE_EXEC),
			br_on_non_null: Number(GAS_ACCOUNTING_OPCODE_EXEC),
		},
	},
};
