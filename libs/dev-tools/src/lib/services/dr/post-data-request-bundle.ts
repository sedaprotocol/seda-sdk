import { calculateDrFunds } from "@dev-tools/services/dr/calculate-dr-funds";
import { tryParseSync } from "@seda-protocol/utils";
import * as v from "valibot";
import { sedachain } from "../../../../../proto-messages/gen";
import type { GasOptions } from "../gas-options";
import { getDrConfig } from "../get-dr-config";
import { signAndSendTx } from "../sign-and-send-tx";
import type { ISigner } from "../signer";
import { createSigningClient } from "../signing-client";
import {
	type PostDataRequestInput,
	createPostedDataRequest,
} from "./create-dr-input";
import type { DataRequest } from "./data-request";
import { PostDataRequestResponseSchema } from "./post-data-request";

const PostDataRequestBundleResponseSchema = v.array(
	PostDataRequestResponseSchema,
);

export async function postDataRequestBundle(
	signer: ISigner,
	dataRequestInputs: PostDataRequestInput[],
	gasOptions?: GasOptions,
): Promise<{ tx: string; drs: DataRequest[] }> {
	const sigingClientResult = await createSigningClient(signer);
	if (sigingClientResult.isErr) {
		throw sigingClientResult.error;
	}

	const contract = signer.getCoreContractAddress();
	const drConfig = await getDrConfig(sigingClientResult.value.client, signer);
	if (drConfig.isErr) {
		throw drConfig.error;
	}

	const { client: sigingClient, address } = sigingClientResult.value;

	const messages = dataRequestInputs.map((dataRequestInput) => {
		const req = createPostedDataRequest(dataRequestInput, drConfig.value);
		return {
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
	});

	const response = await signAndSendTx(
		sigingClient,
		address,
		messages,
		gasOptions,
	);

	if (response.isErr) {
		throw response.error;
	}

	if (response.value.code === 1) {
		throw new Error(`TX failed: "${response.value.transactionHash}"`);
	}

	const drsResponse = response.value.msgResponses.map((messageResponseRaw) => {
		const messageResponse = sigingClient.registry.decode(messageResponseRaw);

		return JSON.parse(Buffer.from(messageResponse.data).toString());
	});

	const drs = tryParseSync(PostDataRequestBundleResponseSchema, drsResponse);
	if (drs.isErr) {
		throw new Error(`Failed to parse DR response: ${drs.error}`);
	}

	return {
		tx: response.value.transactionHash,
		drs: drs.value,
	};
}
