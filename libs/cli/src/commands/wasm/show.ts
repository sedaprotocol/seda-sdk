import { Command } from 'commander';

import { spinnerSuccess, updateSpinnerText } from '../spinner.js';
import { queryDataRequestWasm } from '../../services/wasm/query.js';
import { getRpcOption } from './options.js';

export const show = new Command('show');
show.description('show a Data Request WASM binary in the SEDA chain');
show.argument('<wasm-hash>', 'Hash of the Data Request WASM binary');
show.option('-r, --rpc [string]', 'Tendermint/CometBFT RPC Endpoint');
show.action(async () => {
  updateSpinnerText('Querying Data Request WASM binary from the SEDA network');

  // Check RPC config
  const endpoint: string = getRpcOption(show);

  // Query DR WASM binaries and display
  const queryResult = await queryDataRequestWasm(endpoint, show.args[0]);

  // Display results
  spinnerSuccess();
  console.log();
  console.table(queryResult);
});
