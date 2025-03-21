import { tryAsync } from "@seda-protocol/utils";
import { WASI, init } from "@wasmer/wasi";
import { Maybe } from "true-myth";
import { CallType, GasMeter } from "./metering.js";
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
	cache?: CacheOptions;
}

export interface VmResult {
	stdout: string;
	stderr: string;
	exitCode: number;
	gasUsed: bigint;
	result?: Uint8Array;
	resultAsString?: string;
}

export async function executeVm(
	callData: VmCallData,
	processId: string,
	notifierBufferOrAdapter: SharedArrayBuffer | VmAdapter,
	asyncRequests: VmActionRequest[] = [],
): Promise<VmResult> {
	await init();

	// First argument matches the Rust Wasmer standard (_start for WASI)
	const wasi = new WASI({
		args: ["_start", ...callData.args],
		env: callData.envs,
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

	const meter = new GasMeter(
		callData.gasLimit ?? BigInt(Number.MAX_SAFE_INTEGER),
	);
	const vmImports = new VmImports(
		meter,
		processId,
		callData,
		notifierBufferOrAdapter,
		asyncRequests,
	);

	const wasmModule = await createWasmModule(callData.binary, callData.cache);

	try {
		// For now rethrow the error (since we wanna keep wasmModule outside so we can re-use a compiled module)
		if (wasmModule.isErr) {
			throw wasmModule.error;
		}

		// Add the startup gas cost which is all bytes in the args list + a constant
		const totalArgsBytes = callData.args.reduce(
			(acc, value) => acc + BigInt(value.length),
			0n,
		);

		meter.applyGasCost(CallType.Startup, totalArgsBytes);

		const wasiImports = wasi.getImports(wasmModule.value) as Record<
			string,
			Record<string, unknown>
		>;

		const finalImports = vmImports.getImports(
			wasiImports as unknown as WebAssembly.Imports,
		);
		const instance = await WebAssembly.instantiate(
			wasmModule.value,
			finalImports,
		);
		const memory = instance.exports.memory;
		vmImports.setMemory(memory as WebAssembly.Memory);
		const exitCode = wasi.start(instance);

		return {
			exitCode,
			stderr: wasi.getStderrString(),
			stdout: wasi.getStdoutString(),
			result: vmImports.result,
			gasUsed: meter.gasUsed,
			resultAsString: new TextDecoder().decode(vmImports.result),
		};
	} catch (err) {
		let stderr = wasi.getStderrString();

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
			VM StdOut: ${wasi.getStdoutString()}
		`);

		let error = `${err}`;
		if (err instanceof Error) {
			error = err.message;
		}

		stderr += `\n${error}`;

		return {
			exitCode: 1,
			stderr,
			stdout: wasi.getStdoutString(),
			result: vmImports.result,
			gasUsed: meter.gasUsed,
			resultAsString: "",
		};
	}
}
