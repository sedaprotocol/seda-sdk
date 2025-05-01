import { randomFillSync } from "node:crypto";
import { tryAsync, trySync } from "@seda-protocol/utils";
import { Maybe, Result } from "true-myth";
import { WASI, useAll } from "uwasi";
import { VmError } from "./errors.js";
import { CallType, GasMeter, OUT_OF_GAS_MESSAGE } from "./metering.js";
import {
	type CacheOptions,
	createWasmModule,
} from "./services/compile-wasm-moudle.js";
import type { VmAdapter } from "./types/vm-adapter.js";
import VmImports from "./vm-imports.js";
import {
	HostToWorker,
	type VmActionRequest,
} from "./worker-host-communication.js";

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

async function internalExecuteVm(
	callData: VmCallData,
	processId: string,
	notifierBufferOrAdapter: SharedArrayBuffer | VmAdapter,
	asyncRequests: VmActionRequest[] = [],
): Promise<VmResult> {
	let stdout = "";
	let stderr = "";

	// We use a JavaScript WASI implementation because the Wasmer version has a memory leak
	const wasi = new WASI({
		// First argument matches the Rust Wasmer standard (_start for WASI)
		args: ["_start", ...callData.args],
		env: callData.envs,
		features: [
			useAll({
				randomFillSync,
				withStdio: {
					outputBuffers: true,
					stdout: (line: string | Uint8Array) => {
						if (typeof line === "string") {
							stdout += line;
						} else {
							const decodedString = trySync(() =>
								new TextDecoder("utf-8", { fatal: true }).decode(line),
							);

							if (decodedString.isOk) {
								stdout += decodedString.value;
							} else {
								throw new VmError("stream did not contain valid UTF-8");
							}
						}
					},
					stderr: (line: string | Uint8Array) => {
						if (typeof line === "string") {
							stderr += line;
						} else {
							const decodedString = trySync(() =>
								new TextDecoder("utf-8", { fatal: true }).decode(line),
							);

							if (decodedString.isOk) {
								stderr += decodedString.value;
							} else {
								throw new VmError("stream did not contain valid UTF-8");
							}
						}
					},
				},
			}),
		],
	});

	if (!(notifierBufferOrAdapter instanceof SharedArrayBuffer)) {
		const hostToWorker = new HostToWorker(notifierBufferOrAdapter, processId);

		for (const asyncRequest of asyncRequests) {
			if (asyncRequest.result.isNothing) {
				const result = await hostToWorker.executeAction(asyncRequest.vmAction);
				asyncRequest.result = Maybe.just(result);
			}
		}
	}

	const gasLimit = callData.gasLimit ?? BigInt(Number.MAX_SAFE_INTEGER);
	const meter = new GasMeter(gasLimit);
	const vmImports = new VmImports(
		meter,
		processId,
		callData,
		notifierBufferOrAdapter,
		asyncRequests,
	);

	let wasmModule: Result<WebAssembly.Module, Error> = Result.err(
		new Error("empty wasm binary"),
	);

	try {
		// Add the startup gas cost which is all bytes in the args list + a constant
		const totalArgsBytes = callData.args.reduce(
			(acc, value) => acc + BigInt(value.length),
			0n,
		);

		// Add the startup gas cost which is all bytes in the args list + a constant
		meter.applyGasCost(CallType.Startup, totalArgsBytes);

		// For now rethrow the error (since we wanna keep wasmModule outside so we can re-use a compiled module)
		wasmModule = await createWasmModule(
			callData.binary,
			callData.vmMode,
			callData.cache,
		);

		if (wasmModule.isErr) {
			throw new VmError(wasmModule.error.message);
		}

		const wasiImports: WebAssembly.Imports = {
			wasi_snapshot_preview1: wasi.wasiImport,
		};

		const finalImports = vmImports.getImports(wasiImports);
		const instance = await WebAssembly.instantiate(
			wasmModule.value,
			finalImports,
		);

		meter.setInstance(instance);
		const memory = instance.exports.memory;
		vmImports.setMemory(memory as WebAssembly.Memory);
		const exitCode = wasi.start(instance);

		return {
			exitCode,
			stderr,
			stdout,
			result: vmImports.result,
			gasUsed: meter.getGasUsed(),
			resultAsString: new TextDecoder().decode(vmImports.result),
		};
	} catch (err) {
		if (vmImports.reExecutionRequest) {
			// This is not an error that happend, we need to re-execute the vm with the result that is expected
			asyncRequests.push(vmImports.reExecutionRequest);

			const subResult = await tryAsync(
				executeVm(
					{
						...callData,
						binary: wasmModule.isOk ? wasmModule.value : callData.binary,
					},
					processId,
					notifierBufferOrAdapter,
					asyncRequests,
				),
			);

			if (subResult.isErr) {
				throw `Could not do sub execution: ${subResult.error}`;
			}

			return subResult.value;
		}

		console.error(`[${processId}] -
			@executeWasm
			Exception threw: ${err}
			VM StdErr: ${stderr}
			VM StdOut: ${stdout}
		`);

		// Out of gas errors still throw an "unreachable" error, which is valid when running out of gas.
		if (meter.isOutOfGas()) {
			stderr += `${OUT_OF_GAS_MESSAGE}`;
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
				stderr += `\n${vmErrorMatch[1]}`;
			} else if (!errString.includes(".js:")) {
				// Prevent stacktraces from being outputted to the explorer
				// The program should already have outputted the error message to stderr (for example in rust the panic! macro)
				stderr += `\n${errString}`;
			}
		}

		return {
			exitCode: 1,
			stderr,
			stdout,
			result: vmImports.result,
			gasUsed: meter.getGasUsed(),
			resultAsString: "",
		};
	}
}

export async function executeVm(
	callData: VmCallData,
	processId: string,
	notifierBufferOrAdapter: SharedArrayBuffer | VmAdapter,
	asyncRequests: VmActionRequest[] = [],
): Promise<VmResult> {
	const result = await internalExecuteVm(
		callData,
		processId,
		notifierBufferOrAdapter,
		asyncRequests,
	);

	// Truncate stdout if limit is specified
	if (callData.stdoutLimit !== undefined && callData.stdoutLimit > 0) {
		// Use string operations instead of Buffer for better memory efficiency
		if (result.stdout.length > callData.stdoutLimit) {
			result.stdout = result.stdout.substring(0, callData.stdoutLimit);
		}
	}

	// Truncate stderr if limit is specified
	if (callData.stderrLimit !== undefined && callData.stderrLimit > 0) {
		// Use string operations instead of Buffer for better memory efficiency
		if (result.stderr.length > callData.stderrLimit) {
			result.stderr = result.stderr.substring(0, callData.stderrLimit);
		}
	}

	return result;
}
