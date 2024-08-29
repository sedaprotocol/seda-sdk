import { Command } from 'commander';
import { Maybe } from 'true-myth';

import {
  spinnerError,
  spinnerSuccess,
  updateSpinnerText,
} from '@dev-tools/cli-utils/spinner';
import { createWasmQueryClient } from '@dev-tools/services/wasm/query-client';
import { buildQueryConfig } from '@dev-tools/services/config';
import { tryAsync } from '@dev-tools/utils/try-async';

export const show = new Command('show');
show.description('show a Data Request WASM binary in the SEDA chain');
show.argument('<wasm-hash>', 'Hash of the Data Request WASM binary');
show.action(async () => {
  const opts = show.optsWithGlobals();
  const queryConfig = buildQueryConfig(opts);
  const wasmQueryClient = await createWasmQueryClient(queryConfig);

  updateSpinnerText('Querying Data Request WASM binary from the SEDA network');

  const hash = show.args[0];
  const queryResult = await tryAsync(async () => {
    return wasmQueryClient.DataRequestWasm({ hash });
  });

  if (queryResult.isErr) {
    spinnerError(queryResult.error);
    return;
  }

  const response = Maybe.of(queryResult.value.wasm);

  response.match({
    Just(wasm) {
      spinnerSuccess();
      console.log();
      console.table({
        hash,
        addedAt: wasm.addedAt,
        expirationHeight: wasm.expirationHeight,
      });
    },
    Nothing() {
      spinnerError(`Unable to find WASM for hash "${hash}"`);
    },
  });
});
