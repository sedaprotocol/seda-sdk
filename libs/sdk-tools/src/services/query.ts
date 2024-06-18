import {
  ProtobufRpcClient,
  QueryClient,
  createProtobufRpcClient,
} from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { sedachain } from "@seda/protobuf";

export async function buildQueryService(endpoint: string) {
  // Tendermint RPC endpoint
  const tendermintClient = await Tendermint34Client.connect(endpoint);

  // Tendermint client to submit unverified ABCI queries
  const queryClient = new QueryClient(tendermintClient);

  // Helper function wraps the generic Stargate query client for use by the specific generated query client
  const rpcClient: ProtobufRpcClient = createProtobufRpcClient(queryClient);

  // Instantiate a specific query client which will have the custom methods defined in the .proto file
  return new sedachain.wasm_storage.v1.QueryClientImpl(rpcClient);
}
