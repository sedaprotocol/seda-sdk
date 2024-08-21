import { Result } from 'true-myth';
import { gzip } from 'node-gzip';
import { sedachain } from '@seda-protocol/proto-messages';
import { createSigningClient } from '../signing-client';
import { signAndSendTx } from '../sign-and-send-tx';
import type { GasOptions } from '../gas-options';
import type { ISigner } from '../signer';

export async function uploadWasmBinary(
  signer: ISigner,
  wasmBinary: Buffer,
  gasOptions: GasOptions
): Promise<Result<{ tx: string; wasmHash: string }, unknown>> {
  const sigingClientResult = await createSigningClient(signer);
  if (sigingClientResult.isErr) {
    return Result.err(sigingClientResult.error);
  }

  const { client: sigingClient, address } = sigingClientResult.value;

  const message = {
    typeUrl: '/sedachain.wasm_storage.v1.MsgStoreDataRequestWasm',
    value: sedachain.wasm_storage.v1.MsgStoreDataRequestWasm.fromPartial({
      sender: address,
      wasm: await gzip(wasmBinary),
    }),
  };

  const response = await signAndSendTx(
    sigingClient,
    address,
    [message],
    gasOptions
  );

  if (response.isErr) {
    return Result.err(response.error);
  }

  if (response.value.code === 1) {
    return Result.err(`TX failed: "${response.value.transactionHash}"`);
  }

  const messageResponse =
    sedachain.wasm_storage.v1.MsgStoreDataRequestWasmResponse.decode(
      response.value.msgResponses[0].value
    );

  return Result.ok({
    tx: response.value.transactionHash,
    wasmHash: messageResponse.hash,
  });
}
