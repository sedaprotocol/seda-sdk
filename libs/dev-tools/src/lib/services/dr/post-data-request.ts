import { sedachain } from "@seda-protocol/proto-messages";
import { tryParseSync } from "@seda-protocol/utils";
import * as v from "valibot";
import type { GasOptions } from "../gas-options";
import { getDrConfig } from "../get-dr-config";
import { signAndSendTx } from "../sign-and-send-tx";
import type { ISigner } from "../signer";
import { createSigningClient } from "../signing-client";
import { calculateDrFunds } from "./calculate-dr-funds";
import {
	type PostDataRequestInput,
	createPostedDataRequest,
} from "./create-dr-input";
import { DataRequest } from "./data-request";

export const PostDataRequestResponseSchema = v.pipe(
	v.object({
		dr_id: v.string(),
		height: v.pipe(
			v.number(),
			v.transform((val) => BigInt(val)),
		),
	}),
	v.transform((val) => new DataRequest(val.dr_id, val.height)),
);

export async function postDataRequest(
	signer: ISigner,
	dataRequestInput: PostDataRequestInput,
	gasOptions?: GasOptions,
): Promise<{ tx: string; dr: DataRequest }> {
	const sigingClientResult = await createSigningClient(signer);
	if (sigingClientResult.isErr) {
		throw sigingClientResult.error;
	}

	const drConfig = await getDrConfig(sigingClientResult.value.client, signer);
	if (drConfig.isErr) {
		throw drConfig.error;
	}

	const { client: sigingClient, address } = sigingClientResult.value;

	const req = createPostedDataRequest(dataRequestInput, drConfig.value);

	const message = {
		typeUrl: "/sedachain.core.v1.MsgPostDataRequest",
		value: sedachain.core.v1.MsgPostDataRequest.fromPartial({
			sender: address,
			funds: { amount: calculateDrFunds(req), denom: "aseda" },
			version: req.posted_dr.version,
			execProgramID: req.posted_dr.exec_program_id,
			execInputs: req.posted_dr.exec_inputs,
			execGasLimit: req.posted_dr.exec_gas_limit,
			tallyProgramID: req.posted_dr.tally_program_id,
			tallyInputs: req.posted_dr.tally_inputs,
			tallyGasLimit: req.posted_dr.tally_gas_limit,
			replicationFactor: req.posted_dr.replication_factor,
			consensusFilter: req.posted_dr.consensus_filter,
			gasPrice: req.posted_dr.gas_price,
			memo: req.posted_dr.memo,
			sEDAPayload: req.seda_payload,
			paybackAddress: req.payback_address,
		}),
	};

	const response = await signAndSendTx(
		sigingClient,
		address,
		[message],
		gasOptions,
	);

	if (response.isErr) {
		throw response.error;
	}

	if (response.value.code === 1) {
		throw new Error(`TX failed: "${response.value.transactionHash}"`);
	}

	const messageResponse = sigingClient.registry.decode(
		response.value.msgResponses[0],
	);

	const drResponse = JSON.parse(Buffer.from(messageResponse.data).toString());
	const dr = tryParseSync(PostDataRequestResponseSchema, drResponse);
	if (dr.isErr) {
		throw new Error(`Failed to parse DR response: ${dr.error}`);
	}

	return {
		tx: response.value.transactionHash,
		dr: dr.value,
	};
}
