import { readFile } from "node:fs/promises";

export const oracleProgram = await readFile(
	"dist/libs/as-sdk-integration-tests/debug.wasm",
);
