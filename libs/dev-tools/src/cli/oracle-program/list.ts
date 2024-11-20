import { Command } from "commander";

import {
	spinnerSuccess,
	updateSpinnerText,
} from "@dev-tools/cli-utils/spinner";
import { buildQueryConfig } from "@dev-tools/services/config";
import { createWasmStorageQueryClient } from "@dev-tools/services/oracle-program/query-client";

export const list = new Command("list");
list.description("list existing Oracle Programs in the SEDA chain");
list.action(async () => {
	const opts = list.optsWithGlobals();
	const queryConfig = buildQueryConfig(opts);
	const wasmStorageQueryClient =
		await createWasmStorageQueryClient(queryConfig);

	updateSpinnerText("Querying Oracle Programs from the SEDA network");

	const queryResult = await wasmStorageQueryClient.OraclePrograms({
		pagination: {
			limit: 20n,
			countTotal: true,
			key: new Uint8Array(),
			offset: 0n,
			reverse: false,
		},
	});

	const result = queryResult.list.map((hashTypePair) => {
		const [hash, expirationHeight] = hashTypePair.split(",");
		return { oracleProgramId: hash, expirationHeight };
	});

	spinnerSuccess();
	console.log();
	console.table(result);
});
