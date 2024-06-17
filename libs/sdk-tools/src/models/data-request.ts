import BN from 'bn.js';
import { keccak256, Keccak256 } from "@cosmjs/crypto";
import { hexToBytes, stringToBytes, toHexString } from "../services/bytes-utils.js";

export interface PostDataRequestArgs {
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
}

/**
 * Hashes the data request args and gives back the Data Request ID
 * @param args
 *
 * @see https://github.com/sedaprotocol/seda-chain-contracts/blob/main/contract/src/msgs/data_requests/mod.rs#L191
 */
export function getDataRequestId(args: Required<PostDataRequestArgs>): string {
  /** @todo we have to decide on a default version */
  const versionHash = keccak256(stringToBytes(args.version));
  const drInputsHash = keccak256(args.drInputs);
  const tallyInputsHash = keccak256(args.tallyInputs);
  const memoHash = keccak256(args.memo ?? new Uint8Array());

  const dataRequestId = new Keccak256();
  dataRequestId.update(versionHash);
  dataRequestId.update(hexToBytes(args.drBinaryId));
  dataRequestId.update(drInputsHash);
  dataRequestId.update(hexToBytes(args.tallyBinaryId));
  dataRequestId.update(tallyInputsHash);
  dataRequestId.update(
    Buffer.from(new BN(args.replicationFactor).toArray('be'))
  );
  dataRequestId.update(Buffer.from(new BN(args.gasPrice).toArray('be')));
  dataRequestId.update(Buffer.from(new BN(args.gasLimit).toArray('be')));
  dataRequestId.update(memoHash);

  return toHexString(dataRequestId.digest());
}
