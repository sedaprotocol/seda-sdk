import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Registry } from '@cosmjs/proto-signing';
import { defaultRegistryTypes } from '@cosmjs/stargate';
import { Result } from 'true-myth';
import { sedachain } from '@seda/protobuf';
import { tryAsync } from '../utils/try-async';
import { ISigner } from './signer';

export async function createSigningClient(
  signer: ISigner
): Promise<
  Result<{ client: SigningCosmWasmClient; address: string }, unknown>
> {
  const registry = new Registry(defaultRegistryTypes);
  registry.register(
    '/sedachain.wasm_storage.v1.MsgStoreDataRequestWasm',
    sedachain.wasm_storage.v1.MsgStoreDataRequestWasm
  );

  const signingClientResult = await tryAsync(async () =>
    SigningCosmWasmClient.connectWithSigner(
      signer.getEndpoint(),
      signer.getSigner(),
      { registry }
    )
  );
  if (signingClientResult.isErr) {
    return Result.err(signingClientResult.error);
  }

  return Result.ok({
    client: signingClientResult.value,
    address: signer.getAddress(),
  });
}
