import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { trySync } from "@seda-protocol/utils";
// @ts-ignore
import { meterWasm } from "@seda-protocol/wasm-metering-ts";
import { Maybe, Result } from "true-myth";
import { costTable } from "../metering.js";
import type { VmCallData } from "../vm.js";

export type CacheOptions = {
	dir: string;
	id: string;
};

export async function createWasmModule(
	binary: Uint8Array | WebAssembly.Module | number[],
	options?: CacheOptions,
): Promise<Result<WebAssembly.Module, Error>> {
	if (binary instanceof WebAssembly.Module) {
		return Result.ok(binary);
	}

	const binaryArray =
		binary instanceof Uint8Array ? binary : new Uint8Array(binary);

	const meteredBinary = await Maybe.of(options).match<Promise<Uint8Array>>({
		Just: async (cacheConfig) => {
			const cacheFilePath = resolve(cacheConfig.dir, cacheConfig.id);
			const hasCachedFile = existsSync(cacheFilePath);

			if (hasCachedFile) {
				return readFile(cacheFilePath);
			}

			const result = meterWasm(binaryArray, costTable);
			await writeFile(cacheFilePath, result);
			return result;
		},
		Nothing: () => Promise.resolve(meterWasm(binaryArray, costTable)),
	});

	return trySync(() => new WebAssembly.Module(meteredBinary));
}
