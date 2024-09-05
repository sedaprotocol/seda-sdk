import type { GasOptions } from "../gas-options";
import { signAndSendTx } from "../sign-and-send-tx";
import type { ISigner } from "../signer";
import { createSigningClient } from "../signing-client";
import {
	type PostDataRequestInput,
	createPostedDataRequest,
} from "./create-dr-input";

export async function postDataRequest(
	signer: ISigner,
	dataRequestInput: PostDataRequestInput,
	gasOptions?: GasOptions,
): Promise<{ tx: string; drId: string }> {
	const sigingClientResult = await createSigningClient(signer);
	if (sigingClientResult.isErr) {
		throw sigingClientResult.error;
	}

	const contract = signer.getCoreContractAddress();

	const { client: sigingClient, address } = sigingClientResult.value;

	const message = {
		typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
		value: {
			sender: address,
			contract,
			msg: Buffer.from(
				JSON.stringify({
					post_data_request: {
						seda_payload: Buffer.from([]).toString("base64"),
						payback_address: Buffer.from("seda_sdk").toString("base64"),
						posted_dr: createPostedDataRequest(dataRequestInput),
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

	const drId = JSON.parse(Buffer.from(messageResponse.data).toString());

	return {
		tx: response.value.transactionHash,
		drId,
	};
}
