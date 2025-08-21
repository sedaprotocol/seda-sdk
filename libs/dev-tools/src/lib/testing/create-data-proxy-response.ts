import { Secp256k1, keccak256 } from "@cosmjs/crypto";
import { ecdsaSign, publicKeyCreate } from "secp256k1";

export const SIGNATURE_HEADER_KEY = "x-seda-signature";
export const PUBLIC_KEY_HEADER_KEY = "x-seda-publickey";
export const SIGNATURE_VERSION_HEADER_KEY = "x-seda-version";

export function createSignedResponseHeaders(
	signature: SignedData,
	headers = new Headers(),
) {
	headers.append(SIGNATURE_HEADER_KEY, signature.signature);
	headers.append(PUBLIC_KEY_HEADER_KEY, signature.publicKey);
	headers.append(SIGNATURE_VERSION_HEADER_KEY, signature.version);

	return headers;
}

export interface SignedData {
	// Hex encoded signature
	signature: string;

	// Hex encoded public key
	publicKey: string;

	// Signature recover id
	recId: number;

	// Version of the signature
	version: string;
}

export interface DataProxyResponse {
	status: number;
	headers: Headers;
	url: string;
	bytes: number[];
	content_length: number;
}

export class TestDataProxy {
	version = "0.1.0";
	privateKey: Buffer;
	publicKey: Buffer;

	constructor() {
		this.privateKey = Buffer.from(new Array(32).fill(1));
		this.publicKey = Buffer.from(publicKeyCreate(this.privateKey, true));
	}

	generateMessage(
		requestUrl: string,
		requestMethod: string,
		requestBody: Buffer,
		responseBody: Buffer,
	) {
		const requestUrlHash = keccak256(Buffer.from(requestUrl));
		const requestMethodHash = keccak256(
			Buffer.from(requestMethod.toUpperCase()),
		);
		const requestBodyHash = keccak256(requestBody);
		const responseBodyHash = keccak256(responseBody);

		return Buffer.concat([
			requestUrlHash,
			requestMethodHash,
			requestBodyHash,
			responseBodyHash,
		]);
	}

	hashAndSign(message: Buffer) {
		return ecdsaSign(keccak256(message), this.privateKey);
	}

	/**
	 * Signs data and gives back a wrapped signed response
	 *
	 * @param data
	 */
	async signData(
		requestUrl: string,
		requestMethod: string,
		requestBody: Buffer,
		responseBody: Buffer,
	): Promise<SignedData> {
		const signResult = this.hashAndSign(
			this.generateMessage(
				requestUrl,
				requestMethod,
				requestBody,
				responseBody,
			),
		);

		return {
			publicKey: this.publicKey.toString("hex"),
			signature: Buffer.from(signResult.signature).toString("hex"),
			recId: signResult.recid,
			version: this.version,
		};
	}

	async createResponse(
		url: string,
		method: string,
		status: number,
		responseBody: Buffer,
		requestBody?: Buffer,
	): Promise<DataProxyResponse> {
		const signResult = await this.signData(
			url,
			method,
			requestBody || Buffer.from([]),
			responseBody,
		);

		return {
			status: status,
			headers: createSignedResponseHeaders(signResult),
			url: url,
			bytes: Array.from(responseBody),
			content_length: responseBody.length,
		};
	}
}
