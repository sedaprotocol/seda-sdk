import assert from 'assert';

type NoneConsensusFilter = {
  method: 'none';
};

type JsonPath = `$${string}`;

type ModeConsensusFilter = {
  method: 'mode';
  /**
   * JSON path used to extract the value to compare from the data request reveal. Should start
   * with '$'.
   */
  jsonPath: JsonPath;
};

// type StdDevConsensusFilter = {
//   method: 'std-dev';
//  /**
//   * JSON path used to extract the value to compare from the data request reveal. Should start
//   * with '$'.
//   */
//   jsonPath: string;
//   /**
//    * How to interpret the value found at the JSON path.
//    */
//   numberType: 'float' | 'int' | 'bigint';
//   /**
//    * A uint64 with 10^6 precision.
//    */
//   maxSigma: string;
// };

type JsonPathFilter = ModeConsensusFilter; // | StdDevConsensusFilter;
export type ConsensusFilter = JsonPathFilter | NoneConsensusFilter;
type FilterMethod = ConsensusFilter['method'];

export function encodeConsensusFilter(filter: ConsensusFilter) {
  const filterBytes: number[] = [getFilterMethodByte(filter)];

  if (isSimpleFilter(filter)) {
    return new Uint8Array(filterBytes);
  }

  if (isJsonPathFilter(filter)) {
    filterBytes.push(...getJsonPathFilterBytes(filter));
  }

  return new Uint8Array(filterBytes);
}

// Filter type narrowing
const simpleFilters = new Set<FilterMethod>(['none']);
function isSimpleFilter(filter: ConsensusFilter) {
  return simpleFilters.has(filter.method);
}

const jsonPathFilters = new Set<FilterMethod>(['mode']);
function isJsonPathFilter(filter: ConsensusFilter): filter is JsonPathFilter {
  return jsonPathFilters.has(filter.method);
}

// Filter encoding
const FILTER_METHOD_NONE = 0x00;
const FILTER_METHOD_MODE = 0x01;
// const FILTER_METHOD_STD_DEV = 0x02;

const filterByteMapping: Record<ConsensusFilter['method'], number> = {
  none: FILTER_METHOD_NONE,
  mode: FILTER_METHOD_MODE,
  // 'std-dev': FILTER_METHOD_STD_DEV,
};

// Single byte
function getFilterMethodByte(filter: ConsensusFilter): number {
  assert(
    filter.method in filterByteMapping,
    `Unknown method "${filter.method}".`
  );

  return filterByteMapping[filter.method];
}

// List of bytes: First 8 are the length of the JSON path bytes encoded as a Uint64. Remaining bytes is the JSON path.
function getJsonPathFilterBytes(filter: JsonPathFilter): number[] {
  assert(
    filter.jsonPath.startsWith('$'),
    `JSON Path should start with $, got ${filter.jsonPath}`
  );

  const pathBytes = new TextEncoder().encode(filter.jsonPath);

  const pathLength = BigInt(pathBytes.length);
  const dataView = new DataView(new ArrayBuffer(8), 0);
  dataView.setBigUint64(0, pathLength);
  const pathLengthBytes = new Uint8Array(dataView.buffer);

  return [...pathLengthBytes, ...pathBytes];
}
