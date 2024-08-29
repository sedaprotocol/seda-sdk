import { Command } from 'commander';

import {
  spinnerSuccess,
  updateSpinnerText,
} from '@dev-tools/cli-utils/spinner';
import { createWasmQueryClient } from '@dev-tools/services/wasm/query-client';
import { buildQueryConfig } from '@dev-tools/services/config';

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

  const result = queryResult.list.map((hashTypePair) => {
    const [hash, expirationHeight] = hashTypePair.split(',');
    return { hash, expirationHeight };
  });

  spinnerSuccess();
  console.log();
  console.table(result);
});
