import { sedachain } from '../../../../gen';
import { createQueryClient } from '../query-client';
import { QueryConfig } from '../config';

export async function createWasmQueryClient(config: QueryConfig) {
  const rpcClient = await createQueryClient(config);
  return new sedachain.wasm_storage.v1.QueryClientImpl(rpcClient);
}
