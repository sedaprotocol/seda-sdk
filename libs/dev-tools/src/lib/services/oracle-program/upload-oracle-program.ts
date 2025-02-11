import { sedachain } from "@seda-protocol/proto-messages";
import { tryAsync } from "@seda-protocol/utils";
import { gzip } from "node-gzip";
import { Result } from "true-myth";
import type { GasOptions } from "../gas-options";
import { signAndSendTx } from "../sign-and-send-tx";
import type { ISigner } from "../signer";
import { createSigningClient } from "../signing-client";
import { createWasmStorageQueryClient } from "./query-client";

export async function uploadOracleProgram(
	signer: ISigner,
	oracleProgram: Buffer,
	gasOptions: GasOptions,
): Promise<Result<{ tx: string; oracleProgramId: string }, unknown>> {
	const sigingClientResult = await createSigningClient(signer);
	if (sigingClientResult.isErr) {
		return Result.err(sigingClientResult.error);
	}

	const { client: sigingClient, address } = sigingClientResult.value;

	const costPerByte = await tryAsync(async () => {
		const queryClient = await createWasmStorageQueryClient({
			rpc: signer.getEndpoint(),
		});

		const params = await queryClient.Params({});

		if (!params.params?.wasmCostPerByte) {
			throw new Error("WASM cost per byte not found");
		}

		return params.params.wasmCostPerByte;
	});

	if (costPerByte.isErr) {
		return Result.err(costPerByte.error);
	}

	const wasmSize = BigInt(oracleProgram.length);
	const storageFee = costPerByte.value * wasmSize;

	const message = {
		typeUrl: "/sedachain.wasm_storage.v1.MsgStoreOracleProgram",
		value: sedachain.wasm_storage.v1.MsgStoreOracleProgram.fromPartial({
			sender: address,
			wasm: await gzip(oracleProgram),
			storageFee: [{ denom: "aseda", amount: storageFee.toString() }],
		}),
	};

	const response = await signAndSendTx(
		sigingClient,
		address,
		[message],
		gasOptions,
	);

	if (response.isErr) {
		return Result.err(response.error);
	}

	if (response.value.code === 1) {
		return Result.err(`TX failed: "${response.value.transactionHash}"`);
	}

	const messageResponse =
		sedachain.wasm_storage.v1.MsgStoreOracleProgramResponse.decode(
			response.value.msgResponses[0].value,
		);

	return Result.ok({
		tx: response.value.transactionHash,
		oracleProgramId: messageResponse.hash,
	});
}
