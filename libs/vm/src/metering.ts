import { Maybe, Result, type Unit } from "true-myth";
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
const GAS_CLOCK_TIME_GET_BASE = TERA_GAS;
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
	ClockTimeGet = 14,
}

export const OUT_OF_GAS_MESSAGE = "Ran out of gas";

export class GasMeter {
	public pointsRemaining: bigint;
	private initialLimit: bigint;
	private instance: Maybe<WebAssembly.Instance> = Maybe.nothing();

	constructor(limit: bigint) {
		this.initialLimit = limit;
		this.pointsRemaining = limit;
	}

	setInstance(instance: WebAssembly.Instance) {
		if (this.instance.isJust) {
			throw new VmError("Instance already set");
		}

		this.instance = Maybe.of(instance);
		this.setRemainingPoints(this.pointsRemaining);
	}

	private setRemainingPoints(points: bigint) {
		const remainingPoints = this.getRemainingPointsExport();

		remainingPoints.value = points;
	}

	getGasUsed(): bigint {
		const remainingPoints = this.getRemainingPoints();

		if (remainingPoints.isErr) {
			return this.initialLimit;
		}

		return this.initialLimit - remainingPoints.value;
	}

	public isOutOfGas(): boolean {
		const remainingPoints = this.getRemainingPoints();

		return remainingPoints.isErr;
	}

	/**
	 * Since it's possible to have 0 points remaining without being out of gas,
	 * we use a result error to indicate if the instance is out of gas.
	 */
	private getRemainingPoints(): Result<bigint, typeof OUT_OF_GAS_MESSAGE> {
		// Since we're already using gas before the instance is set (such as the startup gas)
		// we use the remaining points as they are on the gas meter.
		// Once the instance is set we set its remaining points to the gas meter remaining points,
		// ensuring any pre-instance gas is accounted for.
		if (this.instance.isNothing) {
			return Result.ok(this.pointsRemaining);
		}

		const instance = this.instance.value;

		const exhaustedPoints = instance.exports.metering_points_exhausted;

		if (!(exhaustedPoints instanceof WebAssembly.Global)) {
			throw new VmError("Metering points exhausted not found on instance");
		}

		if (!Number.isInteger(exhaustedPoints.value)) {
			throw new VmError(
				"Metering points exhausted from instance has wrong type",
			);
		}

		if (exhaustedPoints.value > 0) {
			return Result.err(OUT_OF_GAS_MESSAGE);
		}

		const remainingPoints = this.getRemainingPointsExport();

		return Result.ok(remainingPoints.value);
	}

	private getRemainingPointsExport() {
		const instance = this.instance.unwrapOrElse(() => {
			throw new VmError("Instance not set");
		});

		const remainingPoints = instance.exports.metering_remaining_points;

		if (!(remainingPoints instanceof WebAssembly.Global)) {
			throw new VmError("Metering points remaining not found on instance");
		}

		if (typeof remainingPoints.value !== "bigint") {
			throw new VmError(
				"Metering points remaining from instance has wrong type",
			);
		}

		return remainingPoints;
	}

	useGas(gasCost: bigint) {
		// While the instance is not set we subtract the gas from the initial limit
		if (this.instance.isNothing) {
			this.pointsRemaining -= gasCost;

			if (this.pointsRemaining < 0n) {
				throw new VmError(OUT_OF_GAS_MESSAGE);
			}
			return;
		}

		const remainingPoints = this.getRemainingPoints();
		if (remainingPoints.isErr) {
			throw new VmError(OUT_OF_GAS_MESSAGE);
		}

		if (remainingPoints.value < gasCost) {
			throw new VmError(OUT_OF_GAS_MESSAGE);
		}

		const newRemainingPoints = remainingPoints.value - gasCost;
		this.setRemainingPoints(newRemainingPoints);
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
			case CallType.ClockTimeGet:
				gasCost = GAS_CLOCK_TIME_GET_BASE;
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
