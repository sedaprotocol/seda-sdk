// @ts-ignore
import { meterWasm } from "@seda-protocol/wasm-metering-ts";
import { WASI, init } from "@wasmer/wasi";
import { CallType, GasMeter, costTable } from "./metering.js";
import VmImports from "./vm-imports.js";

export interface VmCallData {
	/** WebAssembly binary to execute */
	binary: Uint8Array | number[];
	/** Command line arguments for the WebAssembly module */
	args: string[];
	/** Environment variables for the WebAssembly module */
	envs: Record<string, string>;
	/** Gas limit for execution (defaults to MAX_SAFE_INTEGER) */
	gasLimit?: bigint;
	allowedImports?: string[];
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
		const binary = Buffer.from(new Uint8Array(callData.binary));
		const meteredWasm = meterWasm(binary, costTable);
		const wasmModule = new WebAssembly.Module(meteredWasm);

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
		console.error(`[${processId}] -
			@executeWasm
			Exception threw: ${err}
			VM StdErr: ${wasi.getStderrString()}
			VM StdOut: ${wasi.getStdoutString()}
		`);

		let stderr = wasi.getStderrString();

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
