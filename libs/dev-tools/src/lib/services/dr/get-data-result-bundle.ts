import { tryAsync } from "@seda-protocol/utils";
import type { QueryConfig } from "../config";
import { type DataRequestResult, getDataResult } from "./get-data-result";

type ResultBatchResponse = {
	drId: string;
	result: DataRequestResult | null;
	error?: unknown;
};

export async function getDataResultBundle(
	queryConfig: QueryConfig,
	drIds: string[],
): Promise<ResultBatchResponse[]> {
	return Promise.all(
		drIds.map(async (drId) => {
			const status = await tryAsync(() => getDataResult(queryConfig, drId));
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
