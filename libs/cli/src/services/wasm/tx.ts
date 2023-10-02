import { gzip } from 'node-gzip';
import { MsgStoreDataRequestWasm } from '../../gen/sedachain/wasm_storage/v1/tx.js';
import { WasmType } from '../../gen/sedachain/wasm_storage/v1/wasm_storage.js';
import { BECH32_ADDRESS_PREFIX, MNEMONIC } from '../../config.js';
import { DirectSecp256k1HdWallet, Registry } from '@cosmjs/proto-signing';
import { SigningStargateClient, defaultRegistryTypes } from '@cosmjs/stargate';

export async function uploadDataRequestWasm(
  endpoint: string,
  wasmBinary: ArrayBuffer,
  address?: string,
  gas?: string
) {
  if (!MNEMONIC) {
    throw Error(
      'Mnemonic phrase need to be defined as environment var `SEDA_MNEMONIC=<phrase>`'
    );
  }
  const mnemonic: string = MNEMONIC;

  // Setup endpoints for WASM storage module
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: BECH32_ADDRESS_PREFIX,
  });
  const myRegistry = new Registry(defaultRegistryTypes);
  myRegistry.register(
    '/sedachain.wasm_storage.v1.MsgStoreDataRequestWasm',
    MsgStoreDataRequestWasm
  );
  const client = await SigningStargateClient.connectWithSigner(
    endpoint,
    signer,
    { registry: myRegistry }
  );

  // In case that address is undefined, pick the first address from wallet
  if (!address) {
    const accounts = await signer.getAccounts();
    if (accounts.length == 0) {
      throw Error('Address for given mnemonics does not exist');
    }
    address = accounts[0].address;
  }

  const message = {
    typeUrl: '/sedachain.wasm_storage.v1.MsgStoreDataRequestWasm',
    value: MsgStoreDataRequestWasm.fromPartial({
      sender: address,
      wasm: await gzip(wasmBinary),
      wasmType: WasmType.WASM_TYPE_DATA_REQUEST,
    }),
  };
  const fee = {
    amount: [],
    gas: gas ?? 'auto',
  };

  return await client.signAndBroadcast(address, [message], fee);
}
