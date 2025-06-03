import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { tryAsync, tryParseSync } from "@seda-protocol/utils";
import { Result, ResultNS } from "true-myth";
import * as v from "valibot";
import type { ISigner } from "./signer";

const DrConfigSchema = v.object({
	dr_reveal_size_limit_in_bytes: v.number(),
	exec_input_limit_in_bytes: v.number(),
	tally_input_limit_in_bytes: v.number(),
	consensus_filter_limit_in_bytes: v.number(),
	memo_limit_in_bytes: v.number(),
	payback_address_limit_in_bytes: v.number(),
	seda_payload_limit_in_bytes: v.number(),
});

export type DrConfig = v.InferOutput<typeof DrConfigSchema>;

export async function getDrConfig(
	signingClient: SigningCosmWasmClient,
	signer: ISigner,
): Promise<Result<DrConfig, unknown>> {
	const contract = signer.getCoreContractAddress();

	const config = await tryAsync(async () =>
		signingClient.queryContractSmart(contract, {
			get_dr_config: {},
		}),
	);
	if (config.isErr) {
		return Result.err(config.error);
	}

	return tryParseSync(DrConfigSchema, config.value);
}
