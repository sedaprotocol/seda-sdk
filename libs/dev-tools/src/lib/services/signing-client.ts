import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import {
	type JsonRpcRequest,
	type JsonRpcSuccessResponse,
	isJsonRpcErrorResponse,
	parseJsonRpcResponse,
} from "@cosmjs/json-rpc";
import { Comet38Client, HttpClient } from "@cosmjs/tendermint-rpc";
import { sedachain } from "@seda-protocol/proto-messages";
import { tryAsync } from "@seda-protocol/utils";
import { MsgExecuteContractResponse } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import makeFetchCookie from "fetch-cookie";
import { Result } from "true-myth";
import type { ISigner } from "./signer";

export async function createSigningClient(
	signer: ISigner,
): Promise<
	Result<{ client: SigningCosmWasmClient; address: string }, unknown>
> {
	const endpoint = signer.getEndpoint();
	const httpClient = new SedaHttpClient(endpoint);
	const cometClient = await Comet38Client.create(httpClient);

	const signingClientResult = await tryAsync(async () =>
		SigningCosmWasmClient.createWithSigner(cometClient, signer.getSigner()),
	);
	if (signingClientResult.isErr) {
		return Result.err(signingClientResult.error);
	}

	signingClientResult.value.registry.register(
		"/sedachain.wasm_storage.v1.MsgStoreOracleProgram",
		sedachain.wasm_storage.v1.MsgStoreOracleProgram,
	);

	signingClientResult.value.registry.register(
		MsgExecuteContractResponse.typeUrl,
		MsgExecuteContractResponse,
	);

	return Result.ok({
		client: signingClientResult.value,
		address: signer.getAddress(),
	});
}

const fetchCookie = makeFetchCookie(fetch);

class SedaHttpClient extends HttpClient {
	async execute(request: JsonRpcRequest): Promise<JsonRpcSuccessResponse> {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		const res = await fetchCookie(this.url, {
			credentials: "include",
			method: "POST",
			body: request ? JSON.stringify(request) : undefined,
			headers,
		});

		if (res.status >= 400) {
			throw new Error(`Bad status on response: ${res.status}`);
		}

		const raw = await res.json();

		const jsonResponse = parseJsonRpcResponse(raw);

		if (isJsonRpcErrorResponse(jsonResponse)) {
			throw new Error(JSON.stringify(jsonResponse.error));
		}

		return jsonResponse;
	}
}
