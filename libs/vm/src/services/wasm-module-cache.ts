import type { Maybe } from "true-myth";
import type { VmCallData } from "../types/vm-call-data";
import { CapacityMap } from "./capacity-map";

export class WasmModuleCache {
	private map: CapacityMap<string, WebAssembly.Module>;

	constructor(capacity: number) {
		this.map = new CapacityMap<string, WebAssembly.Module>(capacity);
	}

	static createCacheKey(vmMode: VmCallData["vmMode"], cacheId: string) {
		return `${vmMode}_${cacheId}`;
	}

	get(
		vmMode: VmCallData["vmMode"],
		cacheId: string,
	): Maybe<WebAssembly.Module> {
		return this.map.get(WasmModuleCache.createCacheKey(vmMode, cacheId));
	}

	set(
		vmMode: VmCallData["vmMode"],
		cacheId: string,
		value: WebAssembly.Module,
	) {
		this.map.set(WasmModuleCache.createCacheKey(vmMode, cacheId), value);
	}
}
