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
import { Signer } from "@dev-tools/services/signer";
import { getWasmBinary } from "@dev-tools/services/wasm/get-wasm-binary";
import { uploadWasmBinary } from "@dev-tools/services/wasm/upload-wasm-binary";
import { tryAsync } from "@dev-tools/utils/try-async";

export const upload = new Command("upload");
upload.description("upload a Data Request WASM binary to the SEDA chain.");
upload.argument(
	"<wasm-filepath>",
	"File path of the Data Request WASM binary.",
);
addGasOptionsToCommand(upload);
upload.action(async () => {
	const gasOptions = getGasOptionsFromCommand(upload);

	const signingConfig = buildSigningConfig(upload.optsWithGlobals());

	const signer = await tryAsync(async () => Signer.fromPartial(signingConfig));
	if (signer.isErr) {
		console.error(signer.error);
		process.exit(1);
	}

	updateSpinnerText("Uploading Data Request WASM binary to the SEDA network");

	const filePath = upload.args[0];
	const wasmBinary = await tryAsync(async () => readFile(filePath));
	if (wasmBinary.isErr) {
		spinnerError(`Failed to read file "${filePath}"`);
		console.error(wasmBinary.error);
		process.exit(1);
	}

	const drWasmId = keccak256(wasmBinary.value);
	const wasm = await getWasmBinary(signer.value, drWasmId);

	if (wasm.isOk) {
		if (wasm.value.isJust) {
			// There is already a binary with the same hash on chain
			spinnerSuccess();
			console.table({
				wasmHash: Buffer.from(wasm.value.value.hash).toString("hex"),
			});
			process.exit(0);
		}
	}

	const response = await uploadWasmBinary(
		signer.value,
		wasmBinary.value,
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
