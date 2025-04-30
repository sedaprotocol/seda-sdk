import * as Secp256k1 from "@noble/secp256k1";
import { trySync } from "@seda-protocol/utils";
import { Maybe } from "true-myth";
import type { ResultJSON } from "true-myth/result";
import { VmError } from "./errors.js";
import { args_get, args_sizes_get } from "./imports/wasi/args_get.js";
import { environ_get, environ_sizes_get } from "./imports/wasi/environ_get.js";
import { fd_write } from "./imports/wasi/fd_write.js";
import { random_get } from "./imports/wasi/random_get.js";
import { CallType, type GasMeter } from "./metering.js";
import { keccak256, secp256k1Verify } from "./services/crypto.js";
import {
	type HttpFetchAction,
	HttpFetchResponse,
	type ProxyHttpFetchAction,
	type ProxyHttpFetchGasCostAction,
} from "./types/vm-actions.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import { PromiseStatus } from "./types/vm-promise.js";
import type { VmCallData } from "./vm.js";
import { VmActionRequest, WorkerToHost } from "./worker-host-communication.js";

export type VmImportsCollection = Record<string, Record<string, unknown>>;

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
	callData: VmCallData;

	// This is because we need to keep track of which async requests we have to do
	// We set this variable to indicate that we must abort the machine and execute this action
	// so that we can re-execute the VM with the result
	reExecutionRequest?: VmActionRequest;

	constructor(
		gasMeter: GasMeter,
		processId: string,
		callData: VmCallData,
		notifierBufferOrAdapter: SharedArrayBuffer | VmAdapter,
		asyncRequests: VmActionRequest[] = [],
	) {
		this.workerToHost = new WorkerToHost(
			notifierBufferOrAdapter,
			asyncRequests,
		);
		this.processId = processId;
		this.gasMeter = gasMeter;
		this.callData = callData;
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
	proxyHttpFetch(action: number, actionLength: number): number {
		this.gasMeter.applyGasCost(
			CallType.ProxyHttpFetchRequest,
			BigInt(actionLength),
		);

		const rawAction = new Uint8Array(
			this.memory?.buffer.slice(action, action + actionLength) ?? [],
		);
		const messageRaw = Buffer.from(rawAction).toString("utf-8");

		try {
			const message: ProxyHttpFetchAction = {
				...JSON.parse(messageRaw),
				type: "proxy-http-fetch-action",
			};
			const gasCostMessage: ProxyHttpFetchGasCostAction = {
				type: "proxy-http-fetch-gas-cost-action",
				fetchAction: message,
			};

			// First we try to fetch the price of the proxy call in gas units
			const gasCostMessageResponse: ResultJSON<string, Error> = JSON.parse(
				this.workerToHost.callActionOnHost(gasCostMessage).toString(),
			);

			if (gasCostMessageResponse.variant === "Err") {
				this.callResult = HttpFetchResponse.createRejectedPromise(
					`${gasCostMessageResponse.error}`,
				).toBuffer();

				return this.callResult.length;
			}

			this.gasMeter.useGas(BigInt(gasCostMessageResponse.value));

			// Now we know for sure we can pay for it. We should now do the actual fetch
			const proxyCallResponse = this.workerToHost.callActionOnHost(message);

			this.gasMeter.applyGasCost(
				CallType.HttpFetchResponse,
				BigInt(proxyCallResponse.length),
			);

			this.callResult = proxyCallResponse;
			return this.callResult.length;
		} catch (error) {
			// Force the VM to exit and notify in executeVm that we need to re-execute
			if (error instanceof VmActionRequest) {
				this.reExecutionRequest = error;
				throw error;
			}

			console.error(
				`[${this.processId}] - @proxyHttpFetch: ${messageRaw}`,
				error,
			);
			this.callResult = new Uint8Array();

			return 0;
		}
	}

	httpFetch(action: number, actionLength: number): number {
		this.gasMeter.applyGasCost(CallType.HttpFetchRequest, BigInt(actionLength));

		const rawAction = new Uint8Array(
			this.memory?.buffer.slice(action, action + actionLength) ?? [],
		);
		const messageRaw = Buffer.from(rawAction).toString("utf-8");

		try {
			const message: HttpFetchAction = {
				...JSON.parse(messageRaw),
				type: "http-fetch-action",
			};

			this.callResult = this.workerToHost.callActionOnHost(message);

			this.gasMeter.applyGasCost(
				CallType.HttpFetchResponse,
				BigInt(this.callResult.length),
			);
			return this.callResult.length;
		} catch (error) {
			// Force the VM to exit and notify in executeVm that we need to re-execute
			if (error instanceof VmActionRequest) {
				this.reExecutionRequest = error;
				throw error;
			}

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
		if (messageLength < 0 || signatureLength < 0 || publicKeyLength < 0) {
			throw new VmError("Negative length provided");
		}

		const totalLen =
			messageLength + BigInt(signatureLength) + BigInt(publicKeyLength);
		this.gasMeter.applyGasCost(CallType.Secp256k1Verify, totalLen);

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
			this.callResult = new Uint8Array();
			throw new VmError(result.error.message);
		}

		this.callResult = result.value;
		return this.callResult.length;
	}

	callResultWrite(result_data_ptr: number, length: number) {
		if (this.callResult.length !== length) {
			throw new VmError(
				"call_result_write: result_data_ptr length does not match call_value length",
			);
		}

		try {
			const memory = new Uint8Array(this.memory?.buffer ?? []);
			memory.set(this.callResult.slice(0, length), result_data_ptr);
			this.callResult = new Uint8Array();
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

	getImports(wasiImports: WebAssembly.Imports): WebAssembly.Imports {
		const finalWasiImports = wasiImports;

		if (this.callData.allowedImports) {
			// Loop through every WASI versions
			for (const wasiVersionKey of Object.keys(wasiImports)) {
				const wasiVersionImports = wasiImports[wasiVersionKey];

				// Then delete any non allowed WASI imports
				for (const wasiFunctionName of Object.keys(wasiVersionImports)) {
					if (this.callData.allowedImports.includes(wasiFunctionName)) {
						continue;
					}

					delete finalWasiImports[wasiVersionKey][wasiFunctionName];
				}
			}
		}

		const injectedWasi: WebAssembly.Imports = {};

		for (const wasiNamespace of Object.keys(wasiImports)) {
			injectedWasi[wasiNamespace] = {
				args_get: (...args: number[]) =>
					args_get(
						this.callData,
						this.gasMeter,
						wasiImports[wasiNamespace].args_get,
						args[0],
						args[1],
					),
				args_sizes_get: (...args: number[]) =>
					args_sizes_get(
						this.callData,
						this.gasMeter,
						wasiImports[wasiNamespace].args_sizes_get,
						args[0],
						args[1],
					),
				fd_write: (...args: number[]) =>
					fd_write(
						this.gasMeter,
						wasiImports[wasiNamespace].fd_write,
						args[0],
						args[1],
						args[2],
						args[3],
					),
				environ_get: (...args: number[]) =>
					environ_get(
						this.callData,
						this.gasMeter,
						wasiImports[wasiNamespace].environ_get,
						args[0],
						args[1],
					),
				environ_sizes_get: (...args: number[]) =>
					environ_sizes_get(
						this.callData,
						this.gasMeter,
						wasiImports[wasiNamespace].environ_sizes_get,
						args[0],
						args[1],
					),
				random_get: (...args: number[]) =>
					random_get(
						this.gasMeter,
						wasiImports[wasiNamespace].random_get,
						args[0],
						args[1],
					),
				proc_exit: wasiImports[wasiNamespace].proc_exit,
			};
		}

		return {
			...injectedWasi,
			seda_v1: {
				proxy_http_fetch: this.proxyHttpFetch.bind(this),
				http_fetch: this.httpFetch.bind(this),
				secp256k1_verify: this.secp256k1Verify.bind(this),
				keccak256: this.keccak256.bind(this),
				call_result_write: this.callResultWrite.bind(this),
				execution_result: this.executionResult.bind(this),
			},
		};
	}
}
