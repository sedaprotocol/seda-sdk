// biome-ignore lint/complexity/noBannedTypes: ImportValues are of the generic type Function
export function extractFunctionFromImportValue(
	input: WebAssembly.ImportValue,
): Function {
	if (typeof input !== "function") {
		throw new Error("import was not a function");
	}

	return input;
}
