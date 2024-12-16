import { tryAsync } from "@seda-protocol/utils";
import type { QueryConfig } from "../config";
import type { DataRequest } from "./data-request";
import { type DataRequestResult, getDataResult } from "./get-data-result";

type ResultBatchResponse = {
	id: string;
	height: bigint;
	result: DataRequestResult | null;
	error?: unknown;
};

export async function getDataResultBundle(
	queryConfig: QueryConfig,
	drs: DataRequest[],
): Promise<ResultBatchResponse[]> {
	return Promise.all(
		drs.map(async (dr) => {
			const status = await tryAsync(() => getDataResult(queryConfig, dr));
			return status.mapOrElse<ResultBatchResponse>(
				(error) => {
					return { id: dr.id, height: dr.height, result: null, error };
				},
				(result) => {
					return { id: dr.id, height: dr.height, result, error: undefined };
				},
			);
		}),
	);
}
