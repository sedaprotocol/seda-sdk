import {
	type InferOutput,
	boolean,
	number,
	object,
	parse,
	pipe,
	string,
	transform,
} from "valibot";
import type { ISigner } from "../signer";
import { createSigningClient } from "../signing-client";

const DataResultSchema = pipe(
	object({
		version: string(),
		dr_id: string(),
		consensus: boolean(),
		exit_code: number(),
		result: string(),
		block_height: number(),
		gas_used: string(),
		payback_address: string(),
		seda_payload: string(),
	}),
	transform((result) => {
		const resultBuffer = Buffer.from(result.result, "base64");

		return {
			version: result.version,
			drId: result.dr_id,
			consensus: result.consensus,
			exitCode: result.exit_code,
			result: `0x${resultBuffer.toString("hex")}`,
			resultAsUtf8: resultBuffer.toString(),
			blockHeight: result.block_height,
			gasUsed: result.gas_used,
			paybackAddress: base64Decode(result.payback_address),
			sedaPayload: base64Decode(result.seda_payload),
		};
	}),
);

export type DataRequestResult = InferOutput<typeof DataResultSchema>;

export async function getDataResult(
	signer: ISigner,
	drId: string,
): Promise<DataRequestResult> {
	const sigingClientResult = await createSigningClient(signer);
	if (sigingClientResult.isErr) {
		throw sigingClientResult.error;
	}

	const { client: sigingClient } = sigingClientResult.value;
	const contract = signer.getCoreContractAddress();

	const drResult = await sigingClient.queryContractSmart(contract, {
		get_data_result: { dr_id: drId },
	});

	if (drResult === null) {
		throw new Error(`No DR found for id: "${drId}"`);
	}

	return parse(DataResultSchema, drResult);
}

function base64Decode(data: string): string {
	return Buffer.from(data, "base64").toString();
}
