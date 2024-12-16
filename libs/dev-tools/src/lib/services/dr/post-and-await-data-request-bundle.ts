import type { GasOptions } from "@dev-tools/services/gas-options";
import type { ISigner } from "@dev-tools/services/signer";
import { awaitDataResultBundle } from "./await-data-result-bundle";
import type { PostDataRequestInput } from "./create-dr-input";
import { postDataRequestBundle } from "./post-data-request-bundle";

type AwaitOptions = Parameters<typeof awaitDataResultBundle>["2"];

export async function postAndAwaitDataRequestBundle(
	signer: ISigner,
	dataRequestInputs: PostDataRequestInput[],
	gasOptions?: GasOptions,
	awaitOptions?: AwaitOptions,
) {
	const postDrResponse = await postDataRequestBundle(
		signer,
		dataRequestInputs,
		gasOptions,
	);

	const dataResults = await awaitDataResultBundle(
		{ rpc: signer.getEndpoint() },
		postDrResponse.drs,
		awaitOptions,
	);

	return dataResults;
}
