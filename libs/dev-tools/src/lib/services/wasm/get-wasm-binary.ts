import { tryAsync } from "@dev-tools/utils/try-async";
import { ISigner } from "../signer";
import { createWasmQueryClient } from "./query-client";
import { Maybe, Result } from "true-myth";
import { Wasm } from "gen/index.sedachain.wasm_storage.v1";

export async function getWasmBinary(signer: ISigner, id: string): Promise<Result<Maybe<Wasm>, string>> {
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