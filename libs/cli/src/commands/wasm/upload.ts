import { Command } from 'commander';
import { readFile } from 'node:fs/promises';

import { ADDRESS, GAS_LIMIT, RPC_ENDPOINT } from '../../config.js';
import { spinnerSuccess, updateSpinnerText } from '../spinner.js';
import { uploadDataRequestWasm } from '../../services/wasm/tx.js';
import { MsgStoreDataRequestWasmResponse } from '../../gen/sedachain/wasm_storage/v1/tx.js';

export const upload = new Command('upload');

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
  updateSpinnerText('Uploading Data Request WASM binary to SEDA network');

  // Tendermint/CometBFT RPC endpoint
  if (!upload.opts().rpc && !RPC_ENDPOINT) {
    throw Error(
      'Tendermint/CometBFT RPC Endpoint must be provided (with --rpc option or env var)'
    );
  }
  const endpoint: string = upload.opts().rpc ? upload.opts().rpc : RPC_ENDPOINT;

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

  // Throw error if transaction failed
  if (response.code == 1) {
    throw Error(`${response.rawLog} (txn: ${response.transactionHash})`);
  }

  // Decode WASM binary hash (used as ID)
  const wasmHash =
    response.msgResponses.length > 0
      ? MsgStoreDataRequestWasmResponse.decode(response.msgResponses[0].value)
          .hash
      : '(empty)';

  // Display results
  spinnerSuccess();
  console.log();
  console.table({
    'txn hash': response.transactionHash,
    'wasm hash': wasmHash,
  });
});
