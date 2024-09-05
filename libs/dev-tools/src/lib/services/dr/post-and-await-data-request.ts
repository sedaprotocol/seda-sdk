import type { GasOptions } from "@dev-tools/services/gas-options";
import type { ISigner } from "@dev-tools/services/signer";
import { awaitDataResult } from "./await-data-result";
import type { PostDataRequestInput } from "./create-dr-input";
import { postDataRequest } from "./post-data-request";

type AwaitOptions = Parameters<typeof awaitDataResult>["2"];

export async function postAndAwaitDataRequest(
	signer: ISigner,
	dataRequestInput: PostDataRequestInput,
	gasOptions?: GasOptions,
	awaitOptions?: AwaitOptions,
) {
	const postDrResponse = await postDataRequest(
		signer,
		dataRequestInput,
		gasOptions,
	);

	const dataResult = await awaitDataResult(
		signer,
		postDrResponse.drId,
		awaitOptions,
	);

	return dataResult;
}
