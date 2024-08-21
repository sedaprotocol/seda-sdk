import { Maybe, Result } from "true-myth";
import type { sedachain } from "@seda-protocol/proto-messages";
import { tryAsync } from "@dev-tools/utils/try-async";
import { ISigner } from "../signer";
import { createWasmQueryClient } from "./query-client";

export async function getWasmBinary(signer: ISigner, id: string): Promise<Result<Maybe<sedachain.wasm_storage.v1.Wasm>, string>> {
    const queryClient = await tryAsync(async () => await createWasmQueryClient({
        rpc: signer.getEndpoint(),
    }));

    if (queryClient.isErr) {
        return Result.err(queryClient.error);
    }

    const binary = await tryAsync(async () => await queryClient.value.DataRequestWasm({
        hash: id,
    }));

    if (binary.isErr) {
        return Result.err(binary.error);
    }

    return Result.ok(Maybe.of(binary.value.wasm));
}
