import { tryAsync } from "@seda-protocol/utils";
import { Maybe } from "true-myth";
import {
	type InferOutput,
	boolean,
	custom,
	number,
	object,
	parse,
	pipe,
	string,
	transform,
} from "valibot";
import type { QueryConfig } from "../config";
import { createBatchingQueryClient } from "./query-client";

const DataResultSchema = pipe(
	object({
		version: string(),
		drId: string(),
		consensus: boolean(),
		exitCode: number(),
		result: custom<Uint8Array>((input) => input instanceof Uint8Array),
		blockHeight: number(),
		gasUsed: number(),
		paybackAddress: string(),
		sedaPayload: string(),
	}),
	transform((result) => {
		const resultBuffer = Buffer.from(result.result);

		return {
			version: result.version,
			drId: result.drId,
			consensus: result.consensus,
			exitCode: result.exitCode,
			result: `0x${resultBuffer.toString("hex")}`,
			resultAsUtf8: resultBuffer.toString(),
			blockHeight: result.blockHeight,
			gasUsed: result.gasUsed,
			paybackAddress: base64Decode(result.paybackAddress),
			sedaPayload: base64Decode(result.sedaPayload),
		};
	}),
);

export type DataRequestResult = InferOutput<typeof DataResultSchema>;

export async function getDataResult(
	queryConfig: QueryConfig,
	drId: string,
): Promise<DataRequestResult> {
	const batchingQueryClient = await createBatchingQueryClient(queryConfig);

	const drResult = (
		await tryAsync(
			batchingQueryClient.DataResult({
				dataRequestId: drId,
			}),
		)
	).map((res) => Maybe.of(res.dataResult));

	if (drResult.isErr) {
		if (drResult.error.message.includes("not found")) {
			throw new Error(`No DR found for id: "${drId}"`);
		}
		throw drResult.error;
	}

	if (drResult.value.isNothing || drResult.value.value.drId === "") {
		throw new Error(`No DR found for id: "${drId}"`);
	}

	return parse(DataResultSchema, drResult.value.value);
}

function base64Decode(data: string): string {
	return Buffer.from(data, "base64").toString();
}
