import { QueryClient, createProtobufRpcClient } from '@cosmjs/stargate';
import { QueryClientImpl } from '../../gen/sedachain/wasm_storage/v1/query.js';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { WasmType } from '../../gen/sedachain/wasm_storage/v1/wasm_storage.js';

export async function queryDataRequestWasms(endpoint: string) {
  const queryService = await buildQueryService(endpoint);
  const queryResult = await queryService.DataRequestWasms({});

  // Transform to something that can be displayed
  const result = queryResult.hashTypePairs.map((item) => {
    const itemComponents = item.split(',');
    return {
      hash: itemComponents[0],
      type: itemComponents[1],
    };
  });

  return result;
}

export async function queryDataRequestWasm(endpoint: string, hash: string) {
  const queryService = await buildQueryService(endpoint);
  const queryResult = await queryService.DataRequestWasm({
    hash,
  });

  // If wasm does not exist, it returns a result with empty/zeroed fields
  if (!queryResult.wasm || queryResult.wasm.hash.length == 0) {
    throw Error('Data Request WASM binary not found');
  }

  // Transform to something that can be displayed
  return {
    hash: toHexString(queryResult.wasm?.hash),
    type: WasmType[queryResult.wasm?.wasmType],
    timestamp: queryResult.wasm?.addedAt?.toUTCString(),
    bytes: queryResult.wasm?.bytecode.length,
  };
}

async function buildQueryService(endpoint: string) {
  // Tendermint RPC endpoint
  const tendermintClient = await Tendermint34Client.connect(endpoint);

  // Use the Tendermint client to submit unverified ABCI queries
  const queryClient = new QueryClient(tendermintClient);

  // Helper function wraps the generic Stargate query client for use by the specific generated query client
  const rpcClient = createProtobufRpcClient(queryClient);

  // Instantiate a specific query client which will have the custom methods defined in the .proto file
  return new QueryClientImpl(rpcClient);
}

function toHexString(byteArray: Uint8Array) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}
