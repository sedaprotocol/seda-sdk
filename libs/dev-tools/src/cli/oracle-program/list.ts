import { Command } from "commander";

import {
	spinnerSuccess,
	updateSpinnerText,
} from "@dev-tools/cli-utils/spinner";
import { buildQueryConfig } from "@dev-tools/services/config";
import { createWasmQueryClient } from "@dev-tools/services/oracle-program/query-client";

export const list = new Command("list");
list.description("list existing Oracle Programs in the SEDA chain");
list.action(async () => {
	const opts = list.optsWithGlobals();
	const queryConfig = buildQueryConfig(opts);
	const wasmQueryClient = await createWasmQueryClient(queryConfig);

	updateSpinnerText("Querying Oracle Programs from the SEDA network");

	const queryResult = await wasmQueryClient.DataRequestWasms({});

	const result = queryResult.list.map((hashTypePair) => {
		const [hash, expirationHeight] = hashTypePair.split(",");
		return { oracleProgramId: hash, expirationHeight };
	});

	spinnerSuccess();
	console.log();
	console.table(result);
});
