import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { MsgExecuteContractResponse } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { Result } from 'true-myth';
import { sedachain } from '@dev-tools/proto';
import { tryAsync } from '@dev-tools/utils/try-async';
import { ISigner } from './signer';

export async function createSigningClient(
  signer: ISigner
): Promise<
  Result<{ client: SigningCosmWasmClient; address: string }, unknown>
> {
  const signingClientResult = await tryAsync(async () =>
    SigningCosmWasmClient.connectWithSigner(
      signer.getEndpoint(),
      signer.getSigner()
    )
  );
  if (signingClientResult.isErr) {
    return Result.err(signingClientResult.error);
  }

  signingClientResult.value.registry.register(
    '/sedachain.wasm_storage.v1.MsgStoreDataRequestWasm',
    sedachain.wasm_storage.v1.MsgStoreDataRequestWasm
  );

  signingClientResult.value.registry.register(
    MsgExecuteContractResponse.typeUrl,
    MsgExecuteContractResponse
  );

  return Result.ok({
    client: signingClientResult.value,
    address: signer.getAddress(),
  });
}
