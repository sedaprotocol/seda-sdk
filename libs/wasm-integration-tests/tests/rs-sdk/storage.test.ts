import { describe, expect, it } from "bun:test";
import {
	DataRequestVmAdapter,
	PromiseStatus,
	type StorageDeleteAction,
	type StorageReadAction,
	type StorageReadResponse,
	type StorageWriteAction,
	callVm,
} from "@seda-protocol/vm";
import { oracleProgram } from "./oracle-program";

class StorageReadResult {
	constructor(private data: Record<string, number[] | null>) {}
	toBuffer(): Uint8Array {
		return new TextEncoder().encode(JSON.stringify(this.data));
	}
}

const hexKey = (key: string) => Buffer.from(key).toString("hex");

class MockStorageAdapter extends DataRequestVmAdapter {
	storage = new Map<string, Buffer>();
	// Records every host call so tests can assert that none was made.
	calls: string[] = [];

	async storageWrite(action: StorageWriteAction): Promise<PromiseStatus<void>> {
		this.calls.push("write");
		for (const [key, value] of Object.entries(action.values)) {
			this.storage.set(key, Buffer.from(value, "hex"));
		}
		return PromiseStatus.fulfilled();
	}

	async storageRead(
		action: StorageReadAction,
	): Promise<PromiseStatus<StorageReadResponse>> {
		this.calls.push("read");
		const result: Record<string, number[] | null> = {};
		for (const key of action.keys) {
			const value = this.storage.get(key);
			result[key] = value ? Array.from(value) : null;
		}
		return PromiseStatus.fulfilled(new StorageReadResult(result));
	}

	async storageDelete(
		action: StorageDeleteAction,
	): Promise<PromiseStatus<void>> {
		this.calls.push("delete");
		for (const key of action.keys) {
			this.storage.delete(key);
		}
		return PromiseStatus.fulfilled();
	}
}

function executeWithMockStorage(
	testName: string,
	adapter: MockStorageAdapter = new MockStorageAdapter(),
) {
	return callVm(
		{
			args: [Buffer.from(testName).toString("hex")],
			envs: { CHAIN_ID: "seda-1-local" },
			binary: new Uint8Array(oracleProgram),
			vmMode: "exec",
		},
		undefined,
		adapter,
		true,
	);
}

describe("rs-sdk:storage", () => {
	it("should write to storage", async () => {
		const result = await executeWithMockStorage("testStorageWrite");
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");
	});

	it("should read from storage", async () => {
		const result = await executeWithMockStorage("testStorageRead");
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");
	});

	it("should keep earlier keys when a later write targets a different key", async () => {
		const adapter = new MockStorageAdapter();

		const result = await executeWithMockStorage(
			"testStorageInsertMerges",
			adapter,
		);
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");

		expect(adapter.storage.get(hexKey("m1"))?.toString()).toBe("one");
		expect(adapter.storage.get(hexKey("m2"))?.toString()).toBe("two");
	});

	it("should overwrite a key that already exists", async () => {
		const adapter = new MockStorageAdapter();

		const result = await executeWithMockStorage(
			"testStorageInsertOverwrites",
			adapter,
		);
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");

		expect(adapter.storage.get(hexKey("o1"))?.toString()).toBe("second");
	});

	it("should let the last write win for a key duplicated in one call", async () => {
		const adapter = new MockStorageAdapter();

		const result = await executeWithMockStorage(
			"testStorageInsertManyDuplicateKeys",
			adapter,
		);
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");

		expect(adapter.storage.get(hexKey("dup"))?.toString()).toBe("second");
	});

	it("should not call the host for empty inputs", async () => {
		const adapter = new MockStorageAdapter();

		const result = await executeWithMockStorage(
			"testStorageEmptyInputs",
			adapter,
		);
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");

		expect(adapter.calls).toEqual([]);
		expect(adapter.storage.size).toBe(0);
	});

	it("should delete from storage", async () => {
		const result = await executeWithMockStorage("testStorageDelete");
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");
	});

	it("should read values persisted by a previous execution", async () => {
		const adapter = new MockStorageAdapter();

		const write = await executeWithMockStorage("testStorageWrite", adapter);
		expect(write.exitCode).toBe(0);

		const result = await executeWithMockStorage(
			"testStorageReadPersisted",
			adapter,
		);
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");
	});

	it("should delete a key persisted by a previous execution", async () => {
		const adapter = new MockStorageAdapter();

		const write = await executeWithMockStorage("testStorageWrite", adapter);
		expect(write.exitCode).toBe(0);

		const result = await executeWithMockStorage(
			"testStorageDeletePersisted",
			adapter,
		);
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");

		const keyA = Buffer.from("key_a").toString("hex");
		const keyB = Buffer.from("key_b").toString("hex");
		expect(adapter.storage.has(keyA)).toBe(false);
		expect(adapter.storage.has(keyB)).toBe(true);
	});

	it("should enforce the storage value size limit on write", async () => {
		const result = await executeWithMockStorage("testStorageWriteValueLimit");
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");
	});

	it("should enforce the storage key size limit on write", async () => {
		const result = await executeWithMockStorage("testStorageWriteKeyLimit");
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");
	});

	it("should enforce the storage key size limit on read", async () => {
		const result = await executeWithMockStorage("testStorageReadKeyLimit");
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");
	});

	it("should enforce the storage key size limit on delete", async () => {
		const result = await executeWithMockStorage("testStorageDeleteKeyLimit");
		expect(result.exitCode).toBe(0);
		expect(result.resultAsString).toBe("ok");
	});
});
