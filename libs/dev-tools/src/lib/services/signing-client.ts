import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
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

  return Result.ok({
    client: signingClientResult.value,
    address: signer.getAddress(),
  });
}
