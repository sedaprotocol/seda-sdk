import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import * as Secp256k1 from "@noble/secp256k1";
import { sedachain } from "@seda-protocol/proto-messages";
import { tryAsync } from "@seda-protocol/utils";
import { Maybe, Result, type Unit } from "true-myth";
import { prove } from "vrf-ts";
import {
	type HttpFetchAction,
	HttpFetchMethod,
	type HttpFetchResponse,
	type ProxyHttpFetchAction,
	type ProxyHttpFetchGasCostAction,
} from "../types/vm-actions";
import type { VmAdapter } from "../types/vm-adapter";
import type { VmCallData } from "../vm";
import { keccak256 } from "./crypto";

Secp256k1.etc.hmacSha256Sync = (k, ...m) =>
	hmac(sha256, k, Secp256k1.etc.concatBytes(...m));

export function generateProxyHttpProofHash(
	drId: string,
	chainId: string,
	contractAddr: string,
): Buffer {
	return keccak256(
		Buffer.concat([
			Buffer.from("is_executor_eligible"),
			Buffer.from(drId),
			Buffer.from(chainId),
			Buffer.from(contractAddr),
		]),
	);
}

export function createProxyHttpProof(
	identityPrivateKey: Buffer,
	drId: string,
	chainId: string,
	contractAddr: string,
): string {
	const messageHash = generateProxyHttpProofHash(drId, chainId, contractAddr);
	const publicKey = Buffer.from(Secp256k1.getPublicKey(identityPrivateKey));
	const signature = prove(identityPrivateKey, messageHash);
	const proof = `${publicKey.toString("hex")}:${drId}:${signature.toString("hex")}`;

	return Buffer.from(proof).toString("base64");
}

export function verifyProxyHttpResponse(
	signature: Uint8Array,
	publicKey: Uint8Array,
	httpAction: ProxyHttpFetchAction,
	response: HttpFetchResponse,
): boolean {
	try {
		// Get request body or empty array if undefined
		const requestBody = httpAction.options.body || new Uint8Array();

		// Calculate all the required hashes
		const requestUrlHash = keccak256(Buffer.from(httpAction.url));
		const requestMethodHash = keccak256(
			Buffer.from(httpAction.options.method.toUpperCase()),
		);
		const requestBodyHash = keccak256(Buffer.from(requestBody));
		const responseBodyHash = keccak256(Buffer.from(response.data.bytes));

		// Concatenate all hashes
		const messageBytes = Buffer.concat([
			requestUrlHash,
			requestMethodHash,
			requestBodyHash,
			responseBodyHash,
		]);

		// Calculate final message hash
		const messageHash = keccak256(messageBytes);

		// Verify the signature
		return Secp256k1.verify(signature, messageHash, publicKey);
	} catch (error) {
		return false;
	}
}

export async function getProxyHttpCallGasCost(
	action: ProxyHttpFetchGasCostAction,
	adapter: VmAdapter,
	callData: VmCallData,
): Promise<Result<Unit, Error>> {
	// const rpc = Maybe.of(callData.rpc);
	// if (rpc.isNothing)
	// 	return Result.err(new Error("RPC cannot be empty on VmCallData"));

	// const clonedAction = structuredClone(action);
	// clonedAction.fetchAction.options.method = HttpFetchMethod.Options;

	// const httpFetchResult = await tryAsync(
	// 	adapter.httpFetch({
	// 		options: clonedAction.fetchAction.options,
	// 		url: clonedAction.fetchAction.url,
	// 		type: "http-fetch-action",
	// 	}),
	// );

	// if (httpFetchResult.isErr) return Result.err(httpFetchResult.error);
	// const httpResponse = HttpFetchResponse.fromPromise(httpFetchResult.value);

	// const publicKeyRaw = Maybe.of(httpResponse.data.headers["x-seda-publickey"]);
	// if (publicKeyRaw.isNothing) {
	// 	return Result.err(new Error("Header x-seda-publickey was not available"));
	// }

	// new sedachain.data_proxy.v1.MsgClientImpl(new );

	return Result.ok();
}
