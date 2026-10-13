import { tryAsync, tryParseSync } from "@seda-protocol/utils";
import { Result } from "true-myth";
import * as v from "valibot";
import { createCoreQueryClient } from "./dr/query-client";
import type { ISigner } from "./signer";

export const DrConfigSchema = v.object({
	commitTimeoutInBlocks: v.number(),
	revealTimeoutInBlocks: v.number(),
	backupDelayInBlocks: v.number(),
	drRevealSizeLimitInBytes: v.number(),
	execInputLimitInBytes: v.number(),
	tallyInputLimitInBytes: v.number(),
	consensusFilterLimitInBytes: v.number(),
	memoLimitInBytes: v.number(),
	paybackAddressLimitInBytes: v.number(),
	sEDAPayloadLimitInBytes: v.number(),
});

export type DrConfig = v.InferOutput<typeof DrConfigSchema>;

export async function getDrConfig(
	signer: ISigner,
): Promise<Result<DrConfig, unknown>> {
	const coreQueryClient = await createCoreQueryClient({
		rpc: signer.getEndpoint(),
	});
	const response = await tryAsync(coreQueryClient.DataRequestConfig({}));

	if (response.isErr) {
		return Result.err(response.error);
	}
	if (!response.value.dataRequestConfig) {
		return Result.err("No data request config found.");
	}

	return tryParseSync(DrConfigSchema, response.value.dataRequestConfig);
}
