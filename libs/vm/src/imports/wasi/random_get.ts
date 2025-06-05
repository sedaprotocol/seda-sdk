import { CallType, type GasMeter } from "../../metering";
import { extractFunctionFromImportValue } from "../import-utils";

export function random_get(
	gasMeter: GasMeter,
	importValue: WebAssembly.ImportValue,
	buf: number,
	bufLen: number,
) {
	gasMeter.applyGasCost(CallType.RandomGet, BigInt(bufLen));
	const func = extractFunctionFromImportValue("random_get", importValue);
	return func(buf, bufLen);
}
