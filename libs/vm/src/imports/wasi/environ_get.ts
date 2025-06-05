import { CallType, type GasMeter } from "../../metering";
import type { VmCallData } from "../../vm";
import { extractFunctionFromImportValue } from "../import-utils";

function getEnvBytesLength(env: Record<string, string>) {
	return Object.entries(env).reduce(
		(acc, [key, value]) => acc + key.length + value.length + 2,
		0,
	);
}

export function environ_get(
	vmCallData: VmCallData,
	gasMeter: GasMeter,
	importValue: WebAssembly.ImportValue,
	environ: number,
	environ_buf: number,
) {
	gasMeter.applyGasCost(
		CallType.EnvironGet,
		BigInt(getEnvBytesLength(vmCallData.envs)),
	);
	const func = extractFunctionFromImportValue("environ_get", importValue);
	return func(environ, environ_buf);
}

export function environ_sizes_get(
	vmCallData: VmCallData,
	gasMeter: GasMeter,
	importValue: WebAssembly.ImportValue,
	environc: number,
	environ_buf_size: number,
) {
	gasMeter.applyGasCost(
		CallType.EnvironSizesGet,
		BigInt(getEnvBytesLength(vmCallData.envs)),
	);
	const func = extractFunctionFromImportValue("environ_sizes_get", importValue);
	return func(environc, environ_buf_size);
}
