import { gzip } from "node-gzip";
import {
  MsgStoreDataRequestWasm,
  MsgStoreDataRequestWasmResponse,
} from "../../gen/sedachain/wasm_storage/v1/tx.js";
import { WasmType } from "../../gen/sedachain/wasm_storage/v1/wasm_storage.js";
import { BECH32_ADDRESS_PREFIX, MNEMONIC } from "../../config.js";
import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import {
  GasPrice,
  SigningStargateClient,
  StdFee,
  defaultRegistryTypes,
} from "@cosmjs/stargate";
import { keccak256 } from "@cosmjs/crypto";

import { toHexString } from "./utils.js";
import { tryAsync } from "../try-async.js";

export async function uploadDataRequestWasm(
  endpoint: string,
  wasmBinary: ArrayBuffer,
  address?: string,
  gas?: string
) {
  if (!MNEMONIC) {
    throw Error(
      "Mnemonic phrase need to be defined as environment var `SEDA_MNEMONIC=<phrase>`"
    );
  }
  const mnemonic: string = MNEMONIC;

  // Setup endpoints for WASM storage module
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: BECH32_ADDRESS_PREFIX,
  });
  const myRegistry = new Registry(defaultRegistryTypes);
  myRegistry.register(
    "/sedachain.wasm_storage.v1.MsgStoreDataRequestWasm",
    MsgStoreDataRequestWasm
  );

  // Tendermint client
  const client = await SigningStargateClient.connectWithSigner(
    endpoint,
    signer,
    { registry: myRegistry, gasPrice: GasPrice.fromString("5000000000aseda") }
  );

  // In case that address is undefined, pick the first address from wallet
  if (!address) {
    const accounts = await signer.getAccounts();
    if (accounts.length == 0) {
      throw Error("Address for given mnemonics does not exist");
    }
    address = accounts[0].address;
  }

  const message = {
    typeUrl: "/sedachain.wasm_storage.v1.MsgStoreDataRequestWasm",
    value: MsgStoreDataRequestWasm.fromPartial({
      sender: address,
      wasm: await gzip(wasmBinary),
      wasmType: WasmType.WASM_TYPE_DATA_REQUEST,
    }),
  };

  const simulatedGas = await client.simulate(address, [message], undefined);
  const gasPrice = BigInt(5000000000);
  const fee = BigInt(simulatedGas) * gasPrice * 3n;

  const stdFee: StdFee = {
    gas: Math.round(simulatedGas * 1.3).toString(),
    amount: [{ denom: "aseda", amount: fee.toString() }],
  };

  const response = await client.signAndBroadcast(address, [message], stdFee);

  // Throw error if transaction failed
  if (response.code == 1) {
    throw Error(`${response.rawLog}
      txn: ${response.transactionHash}
      wasmHash: ${toHexString(keccak256(new Uint8Array(wasmBinary)))}
    `);
  }

  // Decode WASM binary hash (used as ID)
  const wasmHash =
    response.msgResponses.length > 0
      ? MsgStoreDataRequestWasmResponse.decode(response.msgResponses[0].value)
          .hash
      : "(empty)";

  return {
    "txn hash": response.transactionHash,
    "wasm hash": wasmHash,
  };
}
