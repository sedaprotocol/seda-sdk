import { calculateDrFunds } from "@dev-tools/services/dr/calculate-dr-funds";
import { tryParseSync } from "@seda-protocol/utils";
import * as v from "valibot";
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
		const postedDr = createPostedDataRequest(dataRequestInput, drConfig.value);
		return {
			typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
			value: {
				sender: address,
				contract,
				funds: [{ amount: calculateDrFunds(postedDr), denom: "aseda" }],
				msg: Buffer.from(
					JSON.stringify({
						post_data_request: {
							seda_payload: Buffer.from([]).toString("base64"),
							payback_address: Buffer.from("seda_sdk").toString("base64"),
							posted_dr: postedDr,
						},
					}),
				),
			},
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
