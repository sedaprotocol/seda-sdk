import { Command } from 'commander';
import { readFile } from 'node:fs/promises';

import { ADDRESS, GAS_LIMIT } from '../../config.js';
import { spinnerSuccess, updateSpinnerText } from '../spinner.js';
import { uploadDataRequestWasm } from '../../services/wasm/tx.js';
import { getRpcOption } from './options.js';

export const upload = new Command('upload');
upload.description('upload a Data Request WASM binary to the SEDA chain');
upload.argument('<wasm-filepath>', 'File path of the Data Request WASM binary');
upload.option('-r, --rpc [string]', 'Tendermint/CometBFT RPC Endpoint');
upload.option(
  '-a, --address [string]',
  'Wallet address in Bech32 format (default: index 0)'
);
upload.option(
  '-g, --gas [string]',
  'Transaction gas limit (default: ' + GAS_LIMIT + ')'
);
upload.action(async () => {
  updateSpinnerText('Uploading Data Request WASM binary to the SEDA network');

  // Tendermint/CometBFT RPC endpoint
  const endpoint: string = getRpcOption(upload);

  // Address (if not defined, first wallet address will be selected)
  const address: string | undefined = upload.opts().address
    ? upload.opts().address
    : ADDRESS;

  // Gas (default `GAS_LIMIT`)
  const gas: string = upload.opts().gas ? upload.opts().gas : GAS_LIMIT;

  //Read WASM bytes from file
  const wasmBinary = await readFile(upload.args[0]);

  // Try to upload DR WASM binary
  const response = await uploadDataRequestWasm(
    endpoint,
    wasmBinary,
    address,
    gas
  );

  // Display results
  spinnerSuccess();
  console.log();
  console.table(response);
});
