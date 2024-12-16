import type { QueryConfig } from "@dev-tools/services/config";
import { tryAsync } from "@seda-protocol/utils";
import type { DataRequest } from "./data-request";
import { getDataResult } from "./get-data-result";

type Opts = {
	/** Defaults to 60 seconds. */
	timeoutSeconds: number;
	/** Defaults to 10 seconds */
	pollingIntervalSeconds: number;
};

export async function awaitDataResult(
	queryConfig: QueryConfig,
	dr: DataRequest,
	opts: Opts = { timeoutSeconds: 60, pollingIntervalSeconds: 10 },
) {
	const timeoutTime = Date.now() + opts.timeoutSeconds * 1000;

	while (Date.now() < timeoutTime) {
		const result = await tryAsync(async () => getDataResult(queryConfig, dr));
		if (!result.isErr && result.value !== null) {
			return result.value;
		}
		await sleep(opts.pollingIntervalSeconds * 1000);
	}

	throw new Error(
		`Timeout: "${dr.toString()}" took longer than ${opts.timeoutSeconds} seconds to execute.`,
	);
}

export function sleep(durationMs: number) {
	return new Promise((resolve) => setTimeout(resolve, durationMs));
}
