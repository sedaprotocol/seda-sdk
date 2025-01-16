import { tryParseSync } from "@seda-protocol/utils";
import * as v from "valibot";
import type { GasOptions } from "../gas-options";
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

	const contract = signer.getCoreContractAddress();

	const { client: sigingClient, address } = sigingClientResult.value;

	const postedDr = createPostedDataRequest(dataRequestInput);

	const message = {
		typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
		value: {
			funds: [{ amount: calculateDrFunds(postedDr), denom: "aseda" }],
			sender: address,
			contract,
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
