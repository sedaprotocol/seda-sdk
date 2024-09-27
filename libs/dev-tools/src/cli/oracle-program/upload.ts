import { readFile } from "node:fs/promises";
import { Command } from "commander";

import {
	addGasOptionsToCommand,
	getGasOptionsFromCommand,
} from "@dev-tools/cli-utils/gas-options-commands";
import { keccak256 } from "@dev-tools/cli-utils/keccak256";
import {
	spinnerError,
	spinnerSuccess,
	updateSpinnerText,
} from "@dev-tools/cli-utils/spinner";
import { buildSigningConfig } from "@dev-tools/services/config";
import { getOracleProgram } from "@dev-tools/services/oracle-program/get-oracle-program";
import { uploadOracleProgram } from "@dev-tools/services/oracle-program/upload-oracle-program";
import { Signer } from "@dev-tools/services/signer";
import { tryAsync } from "@seda-protocol/utils";

export const upload = new Command("upload");
upload.description("upload an Oracle Program to the SEDA chain.");
upload.argument("<wasm-filepath>", "File path of the Oracle Program.");
addGasOptionsToCommand(upload);
upload.action(async () => {
	const gasOptions = getGasOptionsFromCommand(upload);

	const signingConfig = buildSigningConfig(upload.optsWithGlobals());

	const signer = await tryAsync(async () => Signer.fromPartial(signingConfig));
	if (signer.isErr) {
		console.error(signer.error);
		process.exit(1);
	}

	updateSpinnerText("Uploading Oracle Program to the SEDA network");

	const filePath = upload.args[0];
	const oracleProgram = await tryAsync(async () => readFile(filePath));
	if (oracleProgram.isErr) {
		spinnerError(`Failed to read file "${filePath}"`);
		console.error(oracleProgram.error);
		process.exit(1);
	}

	const oracleProgramId = keccak256(oracleProgram.value);
	const existingOracleProgram = await getOracleProgram(
		signer.value,
		oracleProgramId,
	);

	if (existingOracleProgram.isOk) {
		if (existingOracleProgram.value.isJust) {
			// There is already an Oracle Program with the same hash on chain
			spinnerSuccess();
			console.table({
				oracleProgramId: Buffer.from(
					existingOracleProgram.value.value.oracleProgramId,
				).toString("hex"),
			});
			process.exit(0);
		}
	}

	const response = await uploadOracleProgram(
		signer.value,
		oracleProgram.value,
		gasOptions,
	);

	response.match({
		Ok(result) {
			spinnerSuccess();
			console.log();
			console.table(result);
		},
		Err(error) {
			spinnerError("Upload failed");
			console.error(error);
		},
	});
});
