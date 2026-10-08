import assert from "node:assert";
import { tryAsync } from "@seda-protocol/utils";
import type { ISigner } from "../signer";
import { createSigningClient } from "../signing-client";
import type { DataRequest } from "./data-request";
import { getDataResult } from "./get-data-result";
import { createCoreQueryClient } from "./query-client";

export type DataRequestStatus =
	| "pending"
	| "committing"
	| "revealing"
	| "resolved";

export async function getDataRequestStatus(
	signer: ISigner,
	dr: DataRequest,
): Promise<{ status: DataRequestStatus }> {
	const coreQueryClient = await createCoreQueryClient({
		rpc: signer.getEndpoint(),
	});
	const response = await tryAsync(
		coreQueryClient.DataRequest({
			drId: dr.id,
		}),
	);

	if (response.isErr) {
		throw response.error;
	}

	if (!response.value.dataRequest) {
		const drResult = await getDataResult({ rpc: signer.getEndpoint() }, dr);

		if (drResult === null) {
			throw new Error(`No request found for ${dr.toString()}`);
		}

		return { status: "resolved" };
	}

	const responseDR = response.value.dataRequest;
	if (!responseDR.dataRequest) {
		throw new Error("Invalid DR response, no data request.");
	}
	if (!responseDR.dataRequest.replicationFactor) {
		throw new Error("Invalid DR response, no replication factor.");
	}
	assert(
		typeof responseDR?.commits === "object",
		"Invalid DR response, no commits map.",
	);
	assert(
		typeof responseDR?.reveals === "object",
		"Invalid DR response, no reveals map.",
	);

	const commitments = Object.keys(responseDR.commits).length;
	const reveals = Object.keys(responseDR.reveals).length;

	const status = getStatus(
		responseDR.dataRequest.replicationFactor,
		commitments,
		reveals,
	);

	return { status };
}

function getStatus(
	replicationFactor: number,
	commitments: number,
	reveals: number,
): DataRequestStatus {
	if (commitments === 0) {
		return "pending";
	}
	if (commitments < replicationFactor) {
		return "committing";
	}
	if (reveals < replicationFactor) {
		return "revealing";
	}

	throw new Error("Invalid DR status");
}
