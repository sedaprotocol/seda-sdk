import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const oracleProgram = await readFile(
	resolve(
		import.meta.dir,
		"../../../../dist/libs/as-sdk-integration-tests/debug.wasm",
	),
);
