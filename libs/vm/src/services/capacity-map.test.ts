import { describe, expect, it } from "bun:test";
import { Maybe } from "true-myth";
import { CapacityMap } from "./capacity-map";

describe("CapacityMap", () => {
	it("should set and get items", () => {
		const map = new CapacityMap<string, string>(10);
		map.set("key", "value");
		expect(map.get("key")).toEqual(Maybe.just("value"));
		expect(map.size()).toEqual(1);
	});

	it("should delete the least recently used item", () => {
		const map = new CapacityMap<string, string>(2);
		map.set("key", "value");
		map.set("key2", "value2");

		// 2 should be the least recently used item
		map.get("key2");

		// Now key3 should delete key 1
		map.set("key3", "value3");

		expect(map.get("key")).toEqual(Maybe.nothing());
		expect(map.get("key2")).toEqual(Maybe.just("value2"));
		expect(map.get("key3")).toEqual(Maybe.just("value3"));
		expect(map.size()).toEqual(2);
	});

	it("should handle large capacity efficiently", () => {
		const capacity = 10000;
		const map = new CapacityMap<string, number>(capacity);

		// Fill the map to capacity
		for (let i = 0; i < capacity; i++) {
			map.set(`key${i}`, i);
		}

		expect(map.size()).toEqual(capacity);

		// Add one more item to trigger eviction
		const startTime = performance.now();
		map.set("overflow", 99999);
		const endTime = performance.now();

		// Should still be at capacity
		expect(map.size()).toEqual(capacity);

		// Should have evicted the least recently used item
		expect(map.get("key0")).toEqual(Maybe.nothing());
		expect(map.get("overflow")).toEqual(Maybe.just(99999));

		// Performance should be very fast (O(1) instead of O(n))
		const duration = endTime - startTime;
		expect(duration).toBeLessThan(10);
	});
});
