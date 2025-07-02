import { randomFillSync } from "node:crypto";
import { existsSync, read } from "node:fs";
import { readFile, writeFile, access, constants } from "node:fs/promises";
import { resolve } from "node:path";
import { tryAsync, trySync } from "@seda-protocol/utils";
// @ts-ignore
import { meterWasm } from "@seda-protocol/wasm-metering-ts";
import { Maybe, Result } from "true-myth";
import { WASI, useAll } from "uwasi";
import { VmError } from "../errors.js";
import { execCostTable, tallyCostTable } from "../metering.js";
import type { VmCallData } from "../vm.js";

export type CacheOptions = {
	dir: string;
	id: string;
};

export async function createWasmModule(
	binary: Uint8Array | WebAssembly.Module | number[],
	vmMode: "tally" | "exec",
	options?: CacheOptions,
): Promise<Result<WebAssembly.Module, Error>> {
	if (binary instanceof WebAssembly.Module) {
		return Result.ok(binary);
	}

	const binaryArray =
		binary instanceof Uint8Array ? binary : new Uint8Array(binary);

	const costTable = vmMode === "exec" ? execCostTable : tallyCostTable;

	const meteredBinary = await Maybe.of(options).match<Promise<Uint8Array>>({
		Just: async (cacheConfig) => {
			const cacheFilePath = resolve(cacheConfig.dir, cacheConfig.id);

			// Check if the file exists
			const hasCachedFile = trySync(() => existsSync(cacheFilePath));

			if (hasCachedFile.isOk && hasCachedFile.value) {
				// Even though the file exists, it may not be accessible and could still fail to read
				const cachedBinary = await tryAsync(readFile(cacheFilePath));

				if (cachedBinary.isOk) {
					return cachedBinary.value;
				}
			}

			const result = meterWasm(Buffer.from(binaryArray), costTable);

			// It's ok if it fails, then there just won't be caching
			await tryAsync(writeFile(cacheFilePath, result));

			return result;
		},
		Nothing: () =>
			Promise.resolve(meterWasm(Buffer.from(binaryArray), costTable)),
	});

	return trySync(() => new WebAssembly.Module(meteredBinary));
}

type OnStdOutCallback = (line: string) => void;

export function createWasi(
	callData: VmCallData,
	onStdout: OnStdOutCallback,
	onStderr: OnStdOutCallback,
) {
	return new WASI({
		// First argument matches the Rust Wasmer standard (_start for WASI)
		args: ["_start", ...callData.args],
		env: callData.envs,
		features: [
			useAll({
				randomFillSync,
				withStdio: {
					outputBuffers: true,
					stdout: (line: string | Uint8Array) => {
						if (typeof line === "string") {
							onStdout(line);
						} else {
							const decodedString = trySync(() =>
								new TextDecoder("utf-8", { fatal: true }).decode(line),
							);

							if (decodedString.isOk) {
								onStdout(decodedString.value);
							} else {
								throw new VmError("stream did not contain valid UTF-8");
							}
						}
					},
					stderr: (line: string | Uint8Array) => {
						if (typeof line === "string") {
							onStderr(line);
						} else {
							const decodedString = trySync(() =>
								new TextDecoder("utf-8", { fatal: true }).decode(line),
							);

							if (decodedString.isOk) {
								onStderr(decodedString.value);
							} else {
								throw new VmError("stream did not contain valid UTF-8");
							}
						}
					},
				},
			}),
		],
	});
}
