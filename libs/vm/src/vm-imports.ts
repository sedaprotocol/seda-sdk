import * as Secp256k1 from "@noble/secp256k1";
import { trySync } from "@seda-protocol/utils";
import { Maybe } from "true-myth";
import { CallType, type GasMeter } from "./metering";
import { keccak256, secp256k1Verify } from "./services/crypto";
import { type HttpFetchAction, HttpFetchResponse } from "./types/vm-actions";
import { PromiseStatus } from "./types/vm-promise";
import { WorkerToHost } from "./worker-host-communication.js";

export default class VmImports {
	memory?: WebAssembly.Memory;
	workerToHost: WorkerToHost;
	// Used for async calls (for knowing the length of the buffer)
	callResult: Uint8Array = new Uint8Array();
	// Execution result
	result: Uint8Array = new Uint8Array();
	usedPublicKeys: string[] = [];
	processId: string;
	gasMeter: GasMeter;

	constructor(
		notifierBuffer: SharedArrayBuffer,
		gasMeter: GasMeter,
		processId: string,
	) {
		this.workerToHost = new WorkerToHost(notifierBuffer, processId);
		this.processId = processId;
		this.gasMeter = gasMeter;
	}

	setMemory(memory: WebAssembly.Memory) {
		this.memory = memory;
	}

	/**
	 * TODO: This function also must create the x-seda-proof the same way the overlay node does it
	 * TODO: This function must be modified to make the verification the same as the data proxy side
	 * @param action
	 * @param actionLength
	 * @returns
	 */
	proxyHttpFetch(action: number, actionLength: number) {
		this.gasMeter.applyGasCost(
			CallType.ProxyHttpFetchRequest,
			BigInt(actionLength),
		);

		const rawAction = new Uint8Array(
			this.memory?.buffer.slice(action, action + actionLength) ?? [],
		);
		const messageRaw = Buffer.from(rawAction).toString("utf-8");
		let length = 0;

		try {
			const message: HttpFetchAction = JSON.parse(messageRaw);
			const rawResponse = Buffer.from(
				this.workerToHost.callActionOnHost(message),
			);
			const httpResponse = HttpFetchResponse.fromPromise(
				PromiseStatus.fromBuffer(rawResponse),
			);

			const signatureRaw = Maybe.of(
				httpResponse.data.headers["x-seda-signature"],
			);
			const publicKeyRaw = Maybe.of(
				httpResponse.data.headers["x-seda-publickey"],
			);

			if (!signatureRaw.isJust) {
				this.callResult = HttpFetchResponse.createRejectedPromise(
					"Header x-seda-signature was not available",
				).toBuffer();
				return this.callResult.length;
			}

			if (!publicKeyRaw.isJust) {
				this.callResult = HttpFetchResponse.createRejectedPromise(
					"Header x-seda-publickey was not available",
				).toBuffer();
				return this.callResult.length;
			}

			// Verify the signature:
			const signature = Buffer.from(signatureRaw.value, "hex");
			const publicKey = Buffer.from(publicKeyRaw.value, "hex");
			const signedMessage = keccak256(Buffer.from(httpResponse.data.bytes));
			const isValidSignature = Secp256k1.verify(
				signature,
				signedMessage,
				publicKey,
			);

			if (!isValidSignature) {
				this.callResult =
					HttpFetchResponse.createRejectedPromise(
						"Invalid signature",
					).toBuffer();
				return this.callResult.length;
			}

			// TODO: Apply the gas cost of a proxy call

			this.usedPublicKeys.push(publicKeyRaw.value);

			this.callResult = rawResponse;
			length = this.callResult.length;
		} catch (error) {
			console.error(`[${this.processId}] - @httpFetch: ${messageRaw}`, error);
			this.callResult = new Uint8Array();

			length = 0;
		}

		this.gasMeter.applyGasCost(
			CallType.HttpFetchResponse,
			BigInt(actionLength),
		);
	}

	httpFetch(action: number, actionLength: number) {
		this.gasMeter.applyGasCost(CallType.HttpFetchRequest, BigInt(actionLength));

		const rawAction = new Uint8Array(
			this.memory?.buffer.slice(action, action + actionLength) ?? [],
		);
		const messageRaw = Buffer.from(rawAction).toString("utf-8");

		try {
			const message: HttpFetchAction = JSON.parse(messageRaw);
			this.callResult = this.workerToHost.callActionOnHost(message);

			this.gasMeter.applyGasCost(
				CallType.Keccak256,
				BigInt(this.callResult.length),
			);
			return this.callResult.length;
		} catch (error) {
			console.error(`[${this.processId}] - @httpFetch: ${messageRaw}`, error);
			this.callResult = new Uint8Array();

			return 0;
		}
	}

	keccak256(messagePtr: number, messageLength: number) {
		this.gasMeter.applyGasCost(CallType.Keccak256, BigInt(messageLength));

		const message = Buffer.from(
			new Uint8Array(
				this.memory?.buffer.slice(messagePtr, messagePtr + messageLength) ?? [],
			),
		);

		const result = trySync(() => keccak256(message));

		if (result.isErr) {
			console.error(
				`[${this.processId}] - @keccak256: ${message}`,
				result.error,
			);
			this.callResult = new Uint8Array();
			return 0;
		}

		this.callResult = result.value;
		return this.callResult.length;
	}

	secp256k1Verify(
		messagePtr: number,
		messageLength: bigint,
		signaturePtr: number,
		signatureLength: number,
		publicKeyPtr: number,
		publicKeyLength: number,
	) {
		this.gasMeter.applyGasCost(CallType.Secp256k1Verify, messageLength);

		const message = Buffer.from(
			new Uint8Array(
				this.memory?.buffer.slice(
					messagePtr,
					messagePtr + Number(messageLength),
				) ?? [],
			),
		);
		const signature = Buffer.from(
			new Uint8Array(
				this.memory?.buffer.slice(
					signaturePtr,
					signaturePtr + signatureLength,
				) ?? [],
			),
		);
		const publicKey = Buffer.from(
			new Uint8Array(
				this.memory?.buffer.slice(
					publicKeyPtr,
					publicKeyPtr + publicKeyLength,
				) ?? [],
			),
		);

		const result = trySync(() =>
			secp256k1Verify(message, signature, publicKey),
		);

		if (result.isErr) {
			console.error(
				`[${this.processId}] - @secp256k1Verify: ${message}`,
				result.error,
			);
			this.callResult = new Uint8Array();
			return 0;
		}

		this.callResult = result.value;
		return this.callResult.length;
	}

	callResultWrite(ptr: number, length: number) {
		try {
			const memory = new Uint8Array(this.memory?.buffer ?? []);
			memory.set(this.callResult.slice(0, length), ptr);
		} catch (err) {
			console.error(`[${this.processId}] - @callResultWrite: `, err);
		}
	}

	executionResult(ptr: number, length: number) {
		this.gasMeter.applyGasCost(CallType.ExecutionResult, BigInt(length));

		this.result = new Uint8Array(
			this.memory?.buffer.slice(ptr, ptr + length) ?? [],
		);
	}

	getImports(wasiImports: object): WebAssembly.Imports {
		return {
			// TODO: Data requests should not have this many imports
			// we should restrict it to only a few
			...wasiImports,
			vm: {
				meter: this.gasMeter.useGas.bind(this.gasMeter),
			},
			seda_v1: {
				// TODO: Should be this.proxyHttpFetch but since thats broken for now we will use httpFetch
				proxy_http_fetch: this.httpFetch.bind(this),
				http_fetch: this.httpFetch.bind(this),
				secp256k1_verify: this.secp256k1Verify.bind(this),
				keccak256: this.keccak256.bind(this),
				call_result_write: this.callResultWrite.bind(this),
				execution_result: this.executionResult.bind(this),
			},
		};
	}
}
