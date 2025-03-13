import { WASI, init } from "@wasmer/wasi";
import { CallType, GasMeter } from "./metering.js";
import VmImports from "./vm-imports.js";
import { type CacheOptions, createWasmModule } from "./services/compile-wasm-moudle.js";

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
	notifierBuffer: SharedArrayBuffer,
	processId: string,
): Promise<VmResult> {
	await init();
	const wasi = new WASI({
		args: callData.args,
		env: callData.envs,
	});

	const meter = new GasMeter(
		callData.gasLimit ?? BigInt(Number.MAX_SAFE_INTEGER),
	);
	const vmImports = new VmImports(notifierBuffer, meter, processId, callData);

	try {
		// Add the startup gas cost which is all bytes in the args list + a constant
		const totalArgsBytes = callData.args.reduce(
			(acc, value) => acc + BigInt(value.length),
			0n,
		);

		meter.applyGasCost(CallType.Startup, totalArgsBytes);
		const wasmModule = await createWasmModule(callData.binary, callData.cache);

		const wasiImports = wasi.getImports(wasmModule) as Record<
			string,
			Record<string, unknown>
		>;

		const finalImports = vmImports.getImports(wasiImports);
		const instance = await WebAssembly.instantiate(wasmModule, finalImports);
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
