import { Command } from 'commander';

import { RPC_ENDPOINT } from '../../config.js';
import { spinnerSuccess, updateSpinnerText } from '../spinner.js';
import { queryDataRequestWasms } from '../../services/wasm/query.js';

export const list = new Command('list');
list.description('list existing Data Request WASM binaries in the SEDA chain');
list.option('-r, --rpc [string]', 'Tendermint/CometBFT RPC Endpoint');
list.action(async () => {
  updateSpinnerText('Querying Data Request WASM binaries from the SEDA network');

  // Check RPC config
  if (!list.opts().rpc && !RPC_ENDPOINT) {
    throw Error(
      'Tendermint/CometBFT RPC Endpoint must be provided (with --rpc option or env var)'
    );
  }
  const endpoint: string = list.opts().rpc ? list.opts().rpc : RPC_ENDPOINT;

  // Query DR WASM binaries and display
  const queryResult = await queryDataRequestWasms(endpoint);

  // Display results
  spinnerSuccess();
  console.log();
  console.table(queryResult.hashTypePairs);
});
