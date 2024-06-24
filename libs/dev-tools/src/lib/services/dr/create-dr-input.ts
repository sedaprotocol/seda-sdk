import {
  type ConsensusFilter,
  encodeConsensusFilter,
} from './consensus-filter';

const DEFAULT_VERSION = '0.0.1';
const DEFAULT_REPLICATION_FACTOR = 1;
const DEFAULT_GAS_LIMIT = 300_000;
const DEFAULT_GAS_PRICE = 1;
const DEFAULT_MEMO = new Uint8Array([]);

export type PostDataRequestInput = {
  version?: string;

  /**
   * Hash of the uploaded Data Request binary Id
   */
  drBinaryId: string;
  /**
   * Inputs encoded in bytes. Input depends on the Data Request WASM binary you are calling
   */
  drInputs: Uint8Array;

  /**
   * Hash of the uploaded Tally binary Id
   * Defaults to the same hash as drBinaryId
   */
  tallyBinaryId?: string;
  /**
   * Inputs encoded in bytes. Input depends on the Tally WASM binary you are calling
   */
  tallyInputs: Uint8Array;

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
   * Defaults to 1
   */
  gasPrice?: number;

  /**
   * Amount of gas units allowed for execution
   * Defaults to 300_000
   */
  gasLimit?: number;

  /**
   * Memo field for any data you want to attach to the Data Request
   * Will also be returned to the destination chain
   */
  memo?: Uint8Array;
};

export function createPostedDataRequest(input: PostDataRequestInput) {
  const version = input.version ?? DEFAULT_VERSION;

  const dr_binary_id = input.drBinaryId;
  const dr_inputs = base64Encode(input.drInputs);

  const tally_binary_id = input.tallyBinaryId ?? input.drBinaryId;
  const tally_inputs = base64Encode(input.tallyInputs);

  const replication_factor =
    input.replicationFactor ?? DEFAULT_REPLICATION_FACTOR;

  const consensus_filter = base64Encode(
    encodeConsensusFilter(input.consensusOptions)
  );

  const gas_limit = (input.gasLimit ?? DEFAULT_GAS_LIMIT).toString();
  const gas_price = (input.gasPrice ?? DEFAULT_GAS_PRICE).toString();

  const memo = base64Encode(input.memo ?? DEFAULT_MEMO);

  return {
    version,
    dr_binary_id,
    dr_inputs,
    tally_binary_id,
    tally_inputs,
    replication_factor,
    consensus_filter,
    gas_limit,
    gas_price,
    memo,
  };
}

function base64Encode(value: Uint8Array): string {
  return Buffer.from(value).toString('base64');
}
