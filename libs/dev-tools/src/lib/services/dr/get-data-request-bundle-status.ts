import { tryAsync } from "@dev-tools/utils/try-async";
import type { ISigner } from "../signer";
import {
	type DataRequestStatus,
	getDataRequestStatus,
} from "./get-data-request-status";

type StatusBatchResponse = {
	drId: string;
	status: DataRequestStatus | null;
	error?: string;
};

export async function getDataRequestBundleStatus(
	signer: ISigner,
	drIds: string[],
): Promise<StatusBatchResponse[]> {
	return Promise.all(
		drIds.map(async (drId) => {
			const status = await tryAsync(() => getDataRequestStatus(signer, drId));
			return status.mapOrElse<StatusBatchResponse>(
				(error) => {
					return { drId, status: null, error };
				},
				({ status }) => {
					return { drId, status, error: undefined };
				},
			);
		}),
	);
}
