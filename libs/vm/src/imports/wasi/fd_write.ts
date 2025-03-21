import { CallType, type GasMeter } from "../../metering";
import { extractFunctionFromImportValue } from "../import-utils";

export function fd_write(
	gasMeter: GasMeter,
	importValue: WebAssembly.ImportValue,
	fd: number,
	iovs: number,
	iovs_len: number,
	nwritten: number,
) {
    gasMeter.applyGasCost(CallType.FdWrite, BigInt(iovs_len));
	const func = extractFunctionFromImportValue(importValue);
	return func(fd, iovs, iovs_len, nwritten);
}
