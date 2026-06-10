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
	/**
	 * Maximum time (ms) a worker-mode VM blocks waiting for the host to answer
	 * a single host call before the call fails. Prevents a dead host from
	 * wedging the VM worker thread forever. Only used in worker (Atomics) mode.
	 */
	hostCallTimeoutMs?: number;
}

export function createCacheKey(processId: string, callData: VmCallData) {
	return `${callData.vmMode}_${callData.cache?.id ?? processId}`;
}
