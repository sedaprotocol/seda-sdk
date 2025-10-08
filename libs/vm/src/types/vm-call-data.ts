import type { CacheOptions } from "../services/wasm-module";
import type { WasmModuleCache } from "../services/wasm-module-cache";

export interface VmCallData {
	/** WebAssembly binary to execute */
	binary: WebAssembly.Module | Uint8Array | number[];
	/** Command line arguments for the WebAssembly module */
	args: string[];
	/** Environment variables for the WebAssembly module */
	envs: Record<string, string>;
	/** Gas limit for execution (defaults to MAX_SAFE_INTEGER) */
	gasLimit?: bigint;
	allowedImports?: string[];
	vmMode: "tally" | "exec";
	cache?: CacheOptions;
	stdoutLimit?: number;
	stderrLimit?: number;
	wasmModuleCache?: WasmModuleCache;
}

export function createCacheKey(processId: string, callData: VmCallData) {
	return `${callData.vmMode}_${callData.cache?.id ?? processId}`;
}
