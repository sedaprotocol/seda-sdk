import {
	spinnerError,
	spinnerSuccess,
	updateSpinnerText,
} from "@dev-tools/cli-utils/spinner";
import { buildQueryConfig } from "@dev-tools/services/config";
import { createWasmStorageQueryClient } from "@dev-tools/services/oracle-program/query-client";
import { tryAsync } from "@seda-protocol/utils";
import { Command } from "commander";
import { Maybe } from "true-myth";

export const show = new Command("show");
show.description("show an Oracle Program in the SEDA chain");
show.argument("<oracle-program-id>", "ID of the Oracle Program");
show.action(async () => {
	const opts = show.optsWithGlobals();
	const queryConfig = buildQueryConfig(opts);
	const wasmStorageQueryClient =
		await createWasmStorageQueryClient(queryConfig);

	updateSpinnerText("Querying Oracle Program from the SEDA network");

	const hash = show.args[0];
	const queryResult = await tryAsync(async () => {
		return wasmStorageQueryClient.OracleProgram({ hash });
	});

	if (queryResult.isErr) {
		spinnerError(queryResult.error);
		return;
	}

	const response = Maybe.of(queryResult.value.oracleProgram);

	response.match({
		Just(oracleProgram) {
			spinnerSuccess();
			console.log();
			console.table({
				oracleProgramId: hash,
				expirationHeight: oracleProgram.expirationHeight,
			});
		},
		Nothing() {
			spinnerError(`Unable to find Oracle Program for id "${hash}"`);
		},
	});
});
