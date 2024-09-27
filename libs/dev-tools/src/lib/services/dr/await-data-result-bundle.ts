import type { ISigner } from "@dev-tools/services/signer";
import { createSigningClient } from "@dev-tools/services/signing-client";
import { tryAsync } from "@seda-protocol/utils";
import { getDataResultBundle } from "./get-data-result-bundle";

type Opts = {
	/** Defaults to 60 seconds. */
	timeoutSeconds: number;
	/** Defaults to 10 seconds */
	pollingIntervalSeconds: number;
};

export async function awaitDataResultBundle(
	signer: ISigner,
	drIds: string[],
	opts: Opts = { timeoutSeconds: 60, pollingIntervalSeconds: 10 },
) {
	const sigingClientResult = await createSigningClient(signer);
	if (sigingClientResult.isErr) {
		throw sigingClientResult.error;
	}
	const timeoutTime = Date.now() + opts.timeoutSeconds * 1000;

	while (Date.now() < timeoutTime) {
		const result = await tryAsync(async () =>
			getDataResultBundle(signer, drIds),
		);
		if (!result.isErr && result.value.every((r) => r.result !== null)) {
			return result.value;
		}
		await sleep(opts.pollingIntervalSeconds * 1000);
	}

	throw new Error(
		`Timeout: bundled data requests took longer than ${opts.timeoutSeconds} seconds to execute.`,
	);
}

export function sleep(durationMs: number) {
	return new Promise((resolve) => setTimeout(resolve, durationMs));
}
