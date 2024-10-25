import { sedachain } from "@seda-protocol/proto-messages";
import type { QueryConfig } from "../config";
import { createProtoQueryClient } from "../proto-query-client";

export async function createBatchingQueryClient(config: QueryConfig) {
	const protoRpcClient = await createProtoQueryClient(config);
	return new sedachain.batching.v1.QueryClientImpl(protoRpcClient);
}
