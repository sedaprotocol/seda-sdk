import { createHash } from "node:crypto";
import type { VmCallData } from "../vm.js";

export function createProcessId(callData: VmCallData): string {
	const hasher = createHash("sha256");
	let binary: Uint8Array;
	if (callData.binary instanceof WebAssembly.Module) {
		// For WebAssembly.Module, we'll use random bytes since we can't access the original
		binary = crypto.getRandomValues(new Uint8Array(32));
	} else if (callData.binary instanceof Uint8Array) {
		binary = callData.binary;
	} else {
		binary = new Uint8Array(callData.binary);
	}
	
	hasher.update(binary);
	const binaryId = hasher.digest().toString("hex");

	return `${callData.args.join("-")}-${binaryId}`;
}
