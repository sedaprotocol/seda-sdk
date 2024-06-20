import { Command } from 'commander';
import { readFile } from 'node:fs/promises';

import {
  spinnerError,
  spinnerSuccess,
  updateSpinnerText,
} from '../utils/spinner';
import {
  addGasOptionsToCommand,
  getGasOptionsFromCommand,
} from '../utils/gas-options-commands';
import { uploadWasmBinary } from '../../lib/services/wasm/upload-wasm-binary';
import { tryAsync } from '../../lib/utils/try-async';
import { Signer } from '../../lib/services/signer';
import { buildSigningConfig } from '../../lib/services/config';

export const upload = new Command('upload');
upload.description('upload a Data Request WASM binary to the SEDA chain.');
upload.argument(
  '<wasm-filepath>',
  'File path of the Data Request WASM binary.'
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

  updateSpinnerText('Uploading Data Request WASM binary to the SEDA network');

  const filePath = upload.args[0];
  const wasmBinary = await tryAsync(async () => readFile(filePath));
  if (wasmBinary.isErr) {
    spinnerError(`Failed to read file "${filePath}"`);
    console.error(wasmBinary.error);
    process.exit(1);
  }

  const response = await uploadWasmBinary(
    signer.value,
    wasmBinary.value,
    gasOptions
  );

  response.match({
    Ok(result) {
      spinnerSuccess();
      console.log();
      console.table(result);
    },
    Err(error) {
      spinnerError('Upload failed');
      console.error(error);
    },
  });
});
