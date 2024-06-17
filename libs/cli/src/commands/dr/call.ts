import { Command } from 'commander';

import { TallyVmAdapter, callVm } from '@seda-protocol/vm';
import { spinnerSuccess, updateSpinnerText } from '../spinner.js';
import { queryDataRequestWasm } from '../../services/wasm/query.js';
import { getRpcOption } from '../wasm/options.js';
import { isDataRequestHash } from '../../services/hash-utils.js';
import { readFile } from 'node:fs/promises';

export const call = new Command('call');
call.description(
  'Calls a data request on the SEDA chain with given input parameters'
);
call.argument('<wasm-hash-or-path>', 'Hash of the Data Request WASM binary');
call.argument('<wasm-arguments>', 'Comma (,) seperated list to pass to the Data Request binary');
call.option('-r, --rpc [string]', 'Tendermint/CometBFT RPC Endpoint');
// show.option('-r, --rpc [string]', 'Tendermint/CometBFT RPC Endpoint');
call.action(async () => {
  const wasmHashOrPath = call.args[0];
  const wasmArguments = call.args[1].split(',');

  let binaryBytes: Uint8Array = new Uint8Array();

  if (isDataRequestHash(wasmHashOrPath)) {
    updateSpinnerText('Fetching binary..');
    // Check RPC config
    const endpoint: string = getRpcOption(call);
    const queryResult = await queryDataRequestWasm(endpoint, wasmHashOrPath);
    binaryBytes = queryResult.bytes;
  } else {
    updateSpinnerText('Reading binary..');
    binaryBytes = await readFile(wasmHashOrPath);
  }

  updateSpinnerText('Encoding call..');

  const result = await callVm({
    args: wasmArguments,
    binary: binaryBytes,
    envs: {},
    method: 'encode'
  }, undefined, new TallyVmAdapter());

  console.log(result);

  // Download the WASM binary from the chain

  // Check RPC config
  //   const endpoint: string = getRpcOption(show);

  //   // Query DR WASM binaries and display
  //   const queryResult = await queryDataRequestWasm(endpoint, show.args[0]);

  // Display results
  spinnerSuccess();
  //   console.log();
  //   console.table(queryResult);
});
