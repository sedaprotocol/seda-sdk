import { tryAsync } from "@seda-protocol/utils";
import { Maybe, Result } from "true-myth";
import type { ISigner } from "../signer";
import { createWasmStorageQueryClient } from "./query-client";

export async function getOracleProgram(
	signer: ISigner,
	id: string,
): Promise<
	Result<
		Maybe<{
			oracleProgramId: string;
			addedAt: Date | undefined;
			bytecode: Uint8Array;
		}>,
		unknown
	>
> {
	const queryClient = await tryAsync(
		async () =>
			await createWasmStorageQueryClient({
				rpc: signer.getEndpoint(),
			}),
	);

	if (queryClient.isErr) {
		return Result.err(queryClient.error);
	}

	const oracleProgram = await tryAsync(
		async () =>
			await queryClient.value.OracleProgram({
				hash: id,
			}),
	);

	if (oracleProgram.isErr) {
		return Result.err(oracleProgram.error);
	}

	const result = Maybe.of(oracleProgram.value.oracleProgram).map(
		(oracleProgram) => ({
			oracleProgramId: id,
			addedAt: oracleProgram.addedAt,
			bytecode: oracleProgram.bytecode,
		}),
	);

	return Result.ok(result);
}
