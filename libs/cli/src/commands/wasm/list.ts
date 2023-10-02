import { Command } from 'commander';

import { spinnerSuccess, updateSpinnerText } from '../spinner.js';
import { queryDataRequestWasms } from '../../services/wasm/query.js';
import { getRpcOption } from './options.js';

export const list = new Command('list');
list.description('list existing Data Request WASM binaries in the SEDA chain');
list.option('-r, --rpc [string]', 'Tendermint/CometBFT RPC Endpoint');
list.action(async () => {
  updateSpinnerText(
    'Querying Data Request WASM binaries from the SEDA network'
  );

  // Check RPC config
  const endpoint: string = getRpcOption(list);

  // Query DR WASM binaries and display
  const queryResult = await queryDataRequestWasms(endpoint);

  // Display results
  spinnerSuccess();
  console.log();
  console.table(queryResult);
});
