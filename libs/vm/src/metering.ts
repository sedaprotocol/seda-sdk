const GAS_PER_OPRATION = 125n * 15n;
const GAS_ACCOUNTING_MULTIPLIER = 3_000n;
const GAS_ACCOUNTING_OPCODE = GAS_PER_OPRATION * GAS_ACCOUNTING_MULTIPLIER;

// Gas for reading and writing bytes
const TERA_GAS = 1_000_000_000_000n;
const GAS_PER_BYTE = 10_000n;
const GAS_STARTUP = TERA_GAS * 5n;

const GAS_PER_BYTE_EXECUTION_RESULT = 10_000_000n;

// Makes it so you can do roughly 30 http requests with the current gas calculations.
const GAS_HTTP_FETCH_BASE = TERA_GAS * 5n;

const GAS_BN254_VERIFY_BASE = 10_000_000n;
// Makes it so you can do roughly 25 proxy http requests with the current gas calculations.
const GAS_PROXY_HTTP_FETCH_BASE = TERA_GAS * 7n;
const GAS_SECP256K1_BASE = 10_000_000n;
const GAS_KECCAK256_BASE = 10_000_000n;

export enum CallType {
	ExecutionResult = 0,
	HttpFetchRequest = 1,
	HttpFetchResponse = 2,
	Bn254Verify = 3,
	ProxyHttpFetchRequest = 4,
	Secp256k1Verify = 5,
	Keccak256 = 6,
	Startup = 7,
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
			throw new Error("Ran out of gas");
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
			default:
				throw new Error("Unknown call type");
		}

		this.useGas(gasCost);
	}
}

export const costTable = {
	type: {
		DEFAULT: Number(GAS_PER_OPRATION),
	},
	code: {
		locals: {
			DEFAULT: Number(GAS_PER_OPRATION),
		},
		code: {
			DEFAULT: Number(GAS_PER_OPRATION),
			loop: Number(GAS_ACCOUNTING_OPCODE),
			end: Number(GAS_ACCOUNTING_OPCODE),
			if: Number(GAS_ACCOUNTING_OPCODE),
			else: Number(GAS_ACCOUNTING_OPCODE),
			br: Number(GAS_ACCOUNTING_OPCODE),
			br_table: Number(GAS_ACCOUNTING_OPCODE),
			br_if: Number(GAS_ACCOUNTING_OPCODE),
			call: Number(GAS_ACCOUNTING_OPCODE),
			call_indirect: Number(GAS_ACCOUNTING_OPCODE),
			return: Number(GAS_ACCOUNTING_OPCODE),
			throw: Number(GAS_ACCOUNTING_OPCODE),
			throw_ref: Number(GAS_ACCOUNTING_OPCODE),
			rethrow: Number(GAS_ACCOUNTING_OPCODE),
			delegate: Number(GAS_ACCOUNTING_OPCODE),
			catch: Number(GAS_ACCOUNTING_OPCODE),
			return_call: Number(GAS_ACCOUNTING_OPCODE),
			return_call_indirect: Number(GAS_ACCOUNTING_OPCODE),
			br_on_cast: Number(GAS_ACCOUNTING_OPCODE),
			br_on_cast_fail: Number(GAS_ACCOUNTING_OPCODE),
			call_ref: Number(GAS_ACCOUNTING_OPCODE),
			return_call_ref: Number(GAS_ACCOUNTING_OPCODE),
			br_on_null: Number(GAS_ACCOUNTING_OPCODE),
			br_on_non_null: Number(GAS_ACCOUNTING_OPCODE),
		},
	},
};
