import { tryAsync } from "@seda-protocol/utils";
import type { ISigner } from "../signer";
import { type DataRequestResult, getDataResult } from "./get-data-result";

type ResultBatchResponse = {
	drId: string;
	result: DataRequestResult | null;
	error?: unknown;
};

export async function getDataResultBundle(
	signer: ISigner,
	drIds: string[],
): Promise<ResultBatchResponse[]> {
	return Promise.all(
		drIds.map(async (drId) => {
			const status = await tryAsync(() => getDataResult(signer, drId));
			return status.mapOrElse<ResultBatchResponse>(
				(error) => {
					return { drId, result: null, error };
				},
				(result) => {
					return { drId, result, error: undefined };
				},
			);
		}),
	);
}
