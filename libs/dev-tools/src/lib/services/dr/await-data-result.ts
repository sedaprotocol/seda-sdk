import type { ISigner } from "@dev-tools/services/signer";
import { createSigningClient } from "@dev-tools/services/signing-client";
import { tryAsync } from "@dev-tools/utils/try-async";
import { getDataResult } from "./get-data-result";

type Opts = {
	/** Defaults to 60 seconds. */
	timeoutSeconds: number;
	/** Defaults to 10 seconds */
	pollingIntervalSeconds: number;
};

export async function awaitDataResult(
	signer: ISigner,
	drId: string,
	opts: Opts = { timeoutSeconds: 60, pollingIntervalSeconds: 10 },
) {
	const sigingClientResult = await createSigningClient(signer);
	if (sigingClientResult.isErr) {
		throw sigingClientResult.error;
	}
	const timeoutTime = Date.now() + opts.timeoutSeconds * 1000;

	while (Date.now() < timeoutTime) {
		const result = await tryAsync(async () => getDataResult(signer, drId));
		if (!result.isErr && result.value !== null) {
			return result.value;
		}
		await sleep(opts.pollingIntervalSeconds * 1000);
	}

	return new Error(
		`Timeout: DR "${drId}" took longer than ${opts.timeoutSeconds} seconds to execute.`,
	);
}

export function sleep(durationMs: number) {
	return new Promise((resolve) => setTimeout(resolve, durationMs));
}
