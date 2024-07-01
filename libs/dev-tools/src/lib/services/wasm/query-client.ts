import { sedachain } from '@dev-tools/proto';
import { createProtoQueryClient } from '../proto-query-client';
import { QueryConfig } from '../config';

export async function createWasmQueryClient(config: QueryConfig) {
  const protoRpcClient = await createProtoQueryClient(config);
  return new sedachain.wasm_storage.v1.QueryClientImpl(protoRpcClient);
}
