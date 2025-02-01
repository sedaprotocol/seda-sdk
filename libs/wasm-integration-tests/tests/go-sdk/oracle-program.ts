import { readFile } from "node:fs/promises";

export const oracleProgram = await readFile(
	"dist/libs/go-sdk-integration-tests/integration-tests.wasm",
);
