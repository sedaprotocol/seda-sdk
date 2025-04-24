import { VmError } from "../errors";

export function extractFunctionFromImportValue(
	input: WebAssembly.ImportValue,
	// biome-ignore lint/complexity/noBannedTypes: ImportValues are of the generic type Function
): Function {
	if (typeof input !== "function") {
		throw new VmError("import was not a function");
	}

	return input;
}
