import { sedachain } from "@seda-protocol/proto-messages";
import type { QueryConfig } from "../config";
import { createProtoQueryClient } from "../proto-query-client";

export async function createWasmStorageQueryClient(config: QueryConfig) {
	const protoRpcClient = await createProtoQueryClient(config);
	return new sedachain.wasm_storage.v1.QueryClientImpl(protoRpcClient);
}
