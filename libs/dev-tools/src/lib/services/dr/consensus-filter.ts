import assert from "node:assert";
import Big from "big.js";

Big.PE = 100000;

type JsonPath = `$${string}`;

const FILTER_METHOD_NONE = 0x00;
type NoneConsensusFilter = {
	method: "none";
};

const FILTER_METHOD_MODE = 0x01;
type ModeConsensusFilter = {
	method: "mode";
	/**
	 * JSON path used to extract the value to compare from the data request reveal. Should start
	 * with '$'.
	 */
	jsonPath: JsonPath;
};

const FILTER_METHOD_MAD = 0x02;
const madNumberTypesMap = {
	int32: 0x00,
	uint32: 0x01,
	int64: 0x02,
	uint64: 0x03,
	int128: 0x04,
	uint128: 0x05,
	int256: 0x06,
	uint256: 0x07,
};

type MadConsensusFilter = {
	/**
	 * Median absolute deviation (MAD) filter.
	 */
	method: "mad";
	/**
	 * JSON path used to extract the value to compare from the data request reveal. Should start
	 * with '$'.
	 */
	jsonPath: JsonPath;
	/**
	 * How to interpret the value found at the JSON path.
	 */
	numberType: keyof typeof madNumberTypesMap;
	/**
	 * Will be converted to a uint64 with 10^6 precision.
	 */
	maxSigma: number;
};

type JsonPathFilter = ModeConsensusFilter | MadConsensusFilter;
export type ConsensusFilter = JsonPathFilter | NoneConsensusFilter;

export function encodeConsensusFilter(filter: ConsensusFilter) {
	switch (filter.method) {
		case "none":
			return encodeNoneFilter(filter);
		case "mode":
			return encodeModeFilter(filter);
		case "mad":
			return encodeMadFilter(filter);
		default:
			// @ts-expect-error In case a caller does not utilise type checking
			throw new Error(`Unknown method "${filter.method}".`);
	}
}

// None filter input looks as follows:
// 0
// | filter_type
function encodeNoneFilter(filter: NoneConsensusFilter): Uint8Array {
	assert(
		filter.method === "none",
		`Can't construct "none" filter for filter method "${filter.method}"`,
	);
	return new Uint8Array([FILTER_METHOD_NONE]);
}

// Mode filter input looks as follows:
// 0             1                  9       9+data_path_length
// | filter_type | data_path_length |   data_path   |
function encodeModeFilter(filter: ModeConsensusFilter): Uint8Array {
	assert(
		filter.method === "mode",
		`Can't construct "mode" filter for filter method "${filter.method}"`,
	);

	return new Uint8Array([
		FILTER_METHOD_MODE,
		...getJsonPathFilterBytes(filter),
	]);
}

// Median absolute deviation (MAD) filter input looks as follows:
// 0             1           9             10                 18 18+json_path_length
// | filter_type | max_sigma | number_type | json_path_length | json_path |
function encodeMadFilter(filter: MadConsensusFilter): Uint8Array {
	assert(
		filter.method === "mad",
		`Can't construct "mad" filter for filter method "${filter.method}"`,
	);

	return new Uint8Array([
		FILTER_METHOD_MAD,
		...getMadFilterBytes(filter),
		...getJsonPathFilterBytes(filter),
	]);
}

// First 8 bytes encode the length of the data path that follows.
// 0                  8       8+data_path_length
// | data_path_length |   data_path   |
function getJsonPathFilterBytes(filter: JsonPathFilter): number[] {
	assert(
		filter.jsonPath.startsWith("$"),
		`JSON Path should start with $, got ${filter.jsonPath}`,
	);

	const pathBytes = new TextEncoder().encode(filter.jsonPath);

	const pathLength = BigInt(pathBytes.length);
	const dataView = new DataView(new ArrayBuffer(8), 0);
	dataView.setBigUint64(0, pathLength);
	const pathLengthBytes = new Uint8Array(dataView.buffer);

	return [...pathLengthBytes, ...pathBytes];
}

// First 8 bytes encode the sigma, last byte encodes the number type.
// 0           8             9
// | max_sigma | number_type |
function getMadFilterBytes(filter: MadConsensusFilter): number[] {
	assert(
		filter.numberType in madNumberTypesMap,
		`Unknown number type "${filter.numberType}" for mad filter.`,
	);

	const sigma = Big(filter.maxSigma).mul(1e6);
	const maxSigma = BigInt(sigma.toFixed(0));

	const dataView = new DataView(new ArrayBuffer(8), 0);
	dataView.setBigUint64(0, maxSigma);
	const maxSigmaBytes = new Uint8Array(dataView.buffer);

	return [...maxSigmaBytes, madNumberTypesMap[filter.numberType]];
}
