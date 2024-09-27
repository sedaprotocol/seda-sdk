import { tryAsync } from "@seda-protocol/utils";
import { Maybe, Result } from "true-myth";
import type { ISigner } from "../signer";
import { createWasmQueryClient } from "./query-client";

export async function getOracleProgram(
	signer: ISigner,
	id: string,
): Promise<
	Result<
		Maybe<{
			oracleProgramId: string;
			addedAt: Date | undefined;
			bytecode: Uint8Array;
			expirationHeight: number;
		}>,
		unknown
	>
> {
	const queryClient = await tryAsync(
		async () =>
			await createWasmQueryClient({
				rpc: signer.getEndpoint(),
			}),
	);

	if (queryClient.isErr) {
		return Result.err(queryClient.error);
	}

	const oracleProgram = await tryAsync(
		async () =>
			await queryClient.value.DataRequestWasm({
				hash: id,
			}),
	);

	if (oracleProgram.isErr) {
		return Result.err(oracleProgram.error);
	}

	const result = Maybe.of(oracleProgram.value.wasm).map((wasm) => ({
		oracleProgramId: id,
		addedAt: wasm.addedAt,
		bytecode: wasm.bytecode,
		expirationHeight: wasm.expirationHeight,
	}));

	return Result.ok(result);
}
