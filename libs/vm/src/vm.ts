import { meterWasm } from "@seda-protocol/wasm-metering";
import { WASI, init } from "@wasmer/wasi";
import { GasMeter, costTable } from "./metering.js";
import VmImports from "./vm-imports.js";

export interface VmCallData {
	binary: Uint8Array | number[];
	args: string[];
	envs: Record<string, string>;
	gasLimit?: bigint;
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

	const meter = new GasMeter(BigInt(callData.gasLimit ?? Number.MAX_SAFE_INTEGER));

	try {
		const binary = Buffer.from(new Uint8Array(callData.binary));
		const meteredWasm = meterWasm(binary, costTable);
		const wasmModule = new WebAssembly.Module(meteredWasm);

		const wasiImports = wasi.getImports(wasmModule);
		const vmImports = new VmImports(notifierBuffer, meter, processId);

		const finalImports = vmImports.getImports(wasiImports, (gas) => {
			meter.applyOpcodeGas(gas);
		});

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

		const stderr = wasi.getStderrString();

		return {
			exitCode: 1,
			stderr: stderr !== "" ? stderr : `${err}`,
			stdout: wasi.getStdoutString(),
			result: new Uint8Array(),
			gasUsed: meter.gasUsed,
			resultAsString: "",
		};
	}
}
