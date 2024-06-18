import { BECH32_ADDRESS_PREFIX, MNEMONIC } from "../../config.js";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice, StdFee } from "@cosmjs/stargate";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

type Bytes = string;
type Hash = Bytes;
type Version = string;
type U128 = string;
type Memo = Bytes;

interface PostDataRequestArgs {
  version: Version;
  dr_binary_id: Hash;
  dr_inputs: Bytes;
  tally_binary_id: Hash;
  tally_inputs: Bytes;
  replication_factor: number;
  gas_price: U128;
  gas_limit: U128;
  memo: Memo;
}

export async function issueDr(
  endpoint: string,
  contract: string,
  dataRequest: PostDataRequestArgs,
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

  // Tendermint client
  const client = await SigningCosmWasmClient.connectWithSigner(
    endpoint,
    signer,
    { gasPrice: GasPrice.fromString("5000000000aseda") }
  );

  // In case that address is undefined, pick the first address from wallet
  if (!address) {
    const accounts = await signer.getAccounts();
    if (accounts.length == 0) {
      throw Error("Address for given mnemonics does not exist");
    }
    address = accounts[0].address;
  }

  const post_dr = {
    post_data_request: {
      seda_payload: base64Encode([]),
      payback_address: base64Encode([]),
      posted_dr: dataRequest,
    },
  };

  const message = {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: {
      sender: address,
      contract,
      msg: Buffer.from(JSON.stringify(post_dr)),
    },
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
    `);
  }

  return {
    "txn hash": response.transactionHash,
  };
}

function base64Encode(value: number[]) {
  return Buffer.from(value).toString("base64");
}
