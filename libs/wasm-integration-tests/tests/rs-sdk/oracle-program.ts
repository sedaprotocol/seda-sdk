import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const oracleProgram = await readFile(
	resolve(
		import.meta.dir,
		"../../../../target/wasm32-wasip1/release-wasm/rs-sdk-integration-tests.wasm",
	),
);
