import { VmError } from "../errors";

// biome-ignore lint/complexity/noBannedTypes: ImportValues are of the generic type Function
export function extractFunctionFromImportValue(
	input: WebAssembly.ImportValue,
): Function {
	if (typeof input !== "function") {
		throw new VmError("import was not a function");
	}

	return input;
}
