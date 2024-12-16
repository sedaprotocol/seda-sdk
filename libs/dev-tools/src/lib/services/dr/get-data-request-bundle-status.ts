import { tryAsync } from "@seda-protocol/utils";
import type { ISigner } from "../signer";
import type { DataRequest } from "./data-request";
import {
	type DataRequestStatus,
	getDataRequestStatus,
} from "./get-data-request-status";

type StatusBatchResponse = {
	drId: string;
	status: DataRequestStatus | null;
	error?: unknown;
};

export async function getDataRequestBundleStatus(
	signer: ISigner,
	drs: DataRequest[],
): Promise<StatusBatchResponse[]> {
	return Promise.all(
		drs.map(async (dr) => {
			const status = await tryAsync(() => getDataRequestStatus(signer, dr));
			return status.mapOrElse<StatusBatchResponse>(
				(error) => {
					return { drId: dr.id, height: dr.height, status: null, error };
				},
				({ status }) => {
					return { drId: dr.id, height: dr.height, status, error: undefined };
				},
			);
		}),
	);
}
