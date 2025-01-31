import { readFile } from "node:fs/promises";

export const oracleProgram = await readFile(
	"target/wasm32-wasip1/release-wasm/rs-sdk-integration-tests.wasm",
);
