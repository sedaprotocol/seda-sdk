import { CallType, type GasMeter } from "../../metering";
import type { VmCallData } from "../../vm";
import { extractFunctionFromImportValue } from "../import-utils";

export function clock_time_get(
    _vmCallData: VmCallData,
    gasMeter: GasMeter,
    importValue: WebAssembly.ImportValue,
    clockid: number,
    precision: bigint,
    timestampPtr: number,
) {
    gasMeter.applyGasCost(
        CallType.ClockTimeGet,
        0n,
    );
    const func = extractFunctionFromImportValue(importValue);
    return func(clockid, precision, timestampPtr);
}