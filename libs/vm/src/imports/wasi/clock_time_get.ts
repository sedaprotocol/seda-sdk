import { CallType, type GasMeter } from "../../metering";
import { extractFunctionFromImportValue } from "../import-utils";

export function clock_time_get(
	gasMeter: GasMeter,
	importValue: WebAssembly.ImportValue,
	...args: number[]
) {
	gasMeter.applyGasCost(CallType.ClockTimeGet, BigInt(0));
	const func = extractFunctionFromImportValue("clock_time_get", importValue);
	return func(...args);
}
