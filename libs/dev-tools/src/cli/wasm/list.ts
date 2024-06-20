import { Command } from 'commander';

import { spinnerSuccess, updateSpinnerText } from '../utils/spinner';
import { createWasmQueryClient } from '../../lib/services/wasm/query-client';
import { buildQueryConfig } from '../../lib/services/config';

export const list = new Command('list');
list.description('list existing Data Request WASM binaries in the SEDA chain');
list.action(async () => {
  const opts = list.optsWithGlobals();
  const queryConfig = buildQueryConfig(opts);
  const wasmQueryClient = await createWasmQueryClient(queryConfig);

  updateSpinnerText(
    'Querying Data Request WASM binaries from the SEDA network'
  );

  const queryResult = await wasmQueryClient.DataRequestWasms({});

  const result = queryResult.hashTypePairs.map((hashTypePair) => {
    const [hash, type] = hashTypePair.split(',');
    return { hash, type };
  });

  spinnerSuccess();
  console.log();
  console.table(result);
});
