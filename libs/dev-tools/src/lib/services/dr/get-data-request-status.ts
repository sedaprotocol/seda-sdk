import assert from "node:assert";
import type { ISigner } from "../signer";
import { createSigningClient } from "../signing-client";
import type { DataRequest } from "./data-request";
import { getDataResult } from "./get-data-result";

export type DataRequestStatus =
	| "pending"
	| "committing"
	| "revealing"
	| "resolved";

export async function getDataRequestStatus(
	signer: ISigner,
	dr: DataRequest,
): Promise<{ status: DataRequestStatus }> {
	const sigingClientResult = await createSigningClient(signer);
	if (sigingClientResult.isErr) {
		throw sigingClientResult.error;
	}

	const { client: sigingClient } = sigingClientResult.value;
	const contract = signer.getCoreContractAddress();

	const contractDr = await sigingClient.queryContractSmart(contract, {
		get_data_request: { dr_id: dr.id },
	});

	if (contractDr === null) {
		const drResult = await getDataResult({ rpc: signer.getEndpoint() }, dr);

		if (drResult === null) {
			throw new Error(`No request found for ${dr.toString()}`);
		}

		return { status: "resolved" };
	}

	const replicationFactor = contractDr?.replication_factor;
	assert(
		Number.isInteger(replicationFactor),
		"Invalid DR response, replication factor is not a number.",
	);
	assert(
		typeof contractDr?.commits === "object",
		"Invalid DR response, no commits map.",
	);
	assert(
		typeof contractDr?.reveals === "object",
		"Invalid DR response, no reveals map.",
	);

	const commitments = Object.keys(contractDr.commits).length;
	const reveals = Object.keys(contractDr.reveals).length;

	const status = getStatus(replicationFactor, commitments, reveals);

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
