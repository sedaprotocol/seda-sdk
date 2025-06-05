import { VmError } from "../errors";

export function extractFunctionFromImportValue(
	name: string,
	input: WebAssembly.ImportValue,
	// biome-ignore lint/complexity/noBannedTypes: ImportValues are of the generic type Function
): Function {
	if (typeof input !== "function") {
		throw new VmError(`import ${name} was not a function`);
	}

	return input;
}
