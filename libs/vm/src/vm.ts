import { Maybe, Result } from "true-myth";
import { VmError } from "./errors.js";
import { CallType, GasMeter, OUT_OF_GAS_MESSAGE } from "./metering.js";
import {
	type CacheOptions,
	createWasi,
	createWasmModule,
} from "./services/wasm-module.js";
import { HttpFetchResponse } from "./types/vm-actions.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import { PromiseStatus } from "./types/vm-promise.js";
import VmImports from "./vm-imports.js";
import { HostToWorker, VmActionRequest } from "./worker-host-communication.js";

export interface VmCallData {
	/** WebAssembly binary to execute */
	binary: WebAssembly.Module | Uint8Array | number[];
	/** Command line arguments for the WebAssembly module */
	args: string[];
	/** Environment variables for the WebAssembly module */
	envs: Record<string, string>;
	/** Gas limit for execution (defaults to MAX_SAFE_INTEGER) */
	gasLimit?: bigint;
	allowedImports?: string[];
	vmMode: "tally" | "exec";
	cache?: CacheOptions;
	stdoutLimit?: number;
	stderrLimit?: number;
}

export interface VmResult {
	stdout: string;
	stderr: string;
	exitCode: number;
	gasUsed: bigint;
	result?: Uint8Array;
	resultAsString?: string;
}

type PropertyWithMessage = {
	message: string;
};

function hasMessageProperty(input: unknown): input is PropertyWithMessage {
	if (input === null) {
		return false;
	}

	if (typeof input === "object") {
		return Object.hasOwn(input, "message");
	}

	return false;
}

export class ExecuteVm {
	public stdout = "";
	public stderr = "";
	public gasMeter: GasMeter;
	private vmImports: VmImports;
	private wasmModule: Maybe<WebAssembly.Module> = Maybe.nothing();
	private asyncRequests: VmActionRequest[] = [];

	constructor(
		private callData: VmCallData,
		public processId: string,
		private notifierBufferOrAdapter: SharedArrayBuffer | VmAdapter,
	) {
		this.gasMeter = new GasMeter(
			callData.gasLimit ?? BigInt(Number.MAX_SAFE_INTEGER),
		);

		this.vmImports = new VmImports(
			this.gasMeter,
			this.processId,
			this.callData,
			this.notifierBufferOrAdapter,
			this.asyncRequests,
		);
	}

	private reset() {
		this.stdout = "";
		this.stderr = "";
		this.gasMeter = new GasMeter(
			this.callData.gasLimit ?? BigInt(Number.MAX_SAFE_INTEGER),
		);
	}

	async internalExecute(): Promise<VmResult> {
		try {
			// First execute all the async requests that we have to handle
			if (!(this.notifierBufferOrAdapter instanceof SharedArrayBuffer)) {
				const hostToWorker = new HostToWorker(
					this.notifierBufferOrAdapter,
					this.processId,
				);

				for (const asyncRequest of this.asyncRequests) {
					if (asyncRequest.result.isNothing) {
						const result = await hostToWorker.executeAction(
							asyncRequest.vmAction,
						);
						asyncRequest.result = Maybe.just(result);
					}
				}
			}

			this.reset();

			// Add the startup gas cost which is all bytes in the args list + a constant
			const totalArgsBytes = this.callData.args.reduce(
				(acc, value) => acc + BigInt(value.length),
				0n,
			);

			// Add the startup gas cost which is all bytes in the args list + a constant
			this.gasMeter.applyGasCost(CallType.Startup, totalArgsBytes);

			const wasi = createWasi(
				this.callData,
				(line) => {
					this.stdout += line;
				},
				(line) => {
					this.stderr += line;
				},
			);

			this.vmImports = new VmImports(
				this.gasMeter,
				this.processId,
				this.callData,
				this.notifierBufferOrAdapter,
				this.asyncRequests,
			);

			const wasmModule = this.wasmModule
				.map((v) => Result.ok(v))
				.unwrapOr(
					await createWasmModule(
						this.callData.binary,
						this.callData.vmMode,
						this.callData.cache,
					),
				);

			if (wasmModule.isErr) {
				throw new VmError(wasmModule.error.message);
			}

			this.wasmModule = Maybe.just(wasmModule.value);
			const wasiImports: WebAssembly.Imports = {
				wasi_snapshot_preview1: wasi.wasiImport,
			};

			const finalImports = this.vmImports.getImports(wasiImports);
			const instance = await WebAssembly.instantiate(
				wasmModule.value,
				finalImports,
			);

			this.gasMeter.setInstance(instance);
			const memory = instance.exports.memory;
			this.vmImports.setMemory(memory as WebAssembly.Memory);

			const exitCode = wasi.start(instance);

			return {
				exitCode,
				stdout: this.stdout,
				stderr: this.stderr,
				result: this.vmImports.result,
				gasUsed: this.gasMeter.getGasUsed(),
				resultAsString: new TextDecoder().decode(this.vmImports.result),
			};
		} catch (err) {
			if (err instanceof VmActionRequest && this.vmImports.reExecutionRequest) {
				// This is not an error that happend, we need to re-execute the vm with the result that is expected
				this.asyncRequests.push(this.vmImports.reExecutionRequest);

				return this.internalExecute();
			}

			console.error(`[${this.processId}] -
                @executeWasm
                Exception threw: ${err}
                VM StdErr: ${this.stderr}
                VM StdOut: ${this.stdout}
		    `);

			if (this.gasMeter.isOutOfGas()) {
				this.stderr += `${OUT_OF_GAS_MESSAGE}`;
			} else {
				let errString: string;

				if (typeof err === "string") {
					errString = err;
				} else if (hasMessageProperty(err)) {
					// To prevent stacktraces from being outputted to the explorer
					errString = err.message;
				} else {
					errString = `${err}`;
				}

				// Extract VmError message if present
				// So we only extract the actual error and not VM wrappers
				const vmErrorMatch = errString.match(/VmError\(([^)]+)\)/);

				if (vmErrorMatch?.[1]) {
					this.stderr += `\n${vmErrorMatch[1]}`;
				} else if (!errString.includes(".js:")) {
					// Prevent stacktraces from being outputted to the explorer
					// The program should already have outputted the error message to stderr (for example in rust the panic! macro)
					this.stderr += `\n${errString}`;
				}
			}

			return {
				exitCode: 1,
				stderr: this.stderr,
				stdout: this.stdout,
				result: this.vmImports.result,
				gasUsed: this.gasMeter.getGasUsed(),
				resultAsString: "",
			};
		}
	}

	async execute() {
		const result = await this.internalExecute();

		// Truncate stdout if limit is specified
		if (
			this.callData.stdoutLimit !== undefined &&
			this.callData.stdoutLimit > 0
		) {
			// Use string operations instead of Buffer for better memory efficiency
			if (result.stdout.length > this.callData.stdoutLimit) {
				result.stdout = result.stdout.substring(0, this.callData.stdoutLimit);
			}
		}

		// Truncate stderr if limit is specified
		if (
			this.callData.stderrLimit !== undefined &&
			this.callData.stderrLimit > 0
		) {
			// Use string operations instead of Buffer for better memory efficiency
			if (result.stderr.length > this.callData.stderrLimit) {
				result.stderr = result.stderr.substring(0, this.callData.stderrLimit);
			}
		}

		return result;
	}
}

export function executeVm(
	callData: VmCallData,
	processId: string,
	notifierBufferOrAdapter: SharedArrayBuffer | VmAdapter,
): Promise<VmResult> {
	const vm = new ExecuteVm(callData, processId, notifierBufferOrAdapter);

	return vm.execute();
}
