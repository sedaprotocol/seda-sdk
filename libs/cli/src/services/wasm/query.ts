import { QueryClient, createProtobufRpcClient } from '@cosmjs/stargate';
import { QueryClientImpl } from '../../gen/sedachain/wasm_storage/v1/query.js';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';

export async function queryDataRequestWasms(endpoint: string) {
  // The Tendermint client knows how to talk to the Tendermint RPC endpoint
  const tendermintClient = await Tendermint34Client.connect(endpoint);

  // The generic Stargate query client knows how to use the Tendermint client to submit unverified ABCI queries
  const queryClient = new QueryClient(tendermintClient);

  // This helper function wraps the generic Stargate query client for use by the specific generated query client
  const rpcClient = createProtobufRpcClient(queryClient);

  // Here we instantiate a specific query client which will have the custom methods defined in the .proto file
  const queryService = new QueryClientImpl(rpcClient);

  // Now you can use this service to submit queries
  return await queryService.DataRequestWasms({});
}
