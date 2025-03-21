import { CallType, type GasMeter } from "../../metering";
import type { VmCallData } from "../../vm";
import { extractFunctionFromImportValue } from "../import-utils";

function getArgsBytesLength(args: string[]): number {
    return args.reduce((acc, arg) => acc + arg.length + 1, 0);
}

export function args_sizes_get(
    vmCallData: VmCallData,
	gasMeter: GasMeter,
	importValue: WebAssembly.ImportValue,
	argc: number,
	argv_buf_size: number,
) {
    gasMeter.applyGasCost(CallType.ArgsSizesGet, BigInt(getArgsBytesLength(vmCallData.args)));
	const func = extractFunctionFromImportValue(importValue);
	return func(argc, argv_buf_size);
}

export function args_get(
    vmCallData: VmCallData,
	gasMeter: GasMeter,
	importValue: WebAssembly.ImportValue,
	argv: number,
	argv_buf: number,
) {
    gasMeter.applyGasCost(CallType.ArgsGet, BigInt(getArgsBytesLength(vmCallData.args)));
	const func = extractFunctionFromImportValue(importValue);
	return func(argv, argv_buf);
}
