import { describe, expect, it } from "bun:test";
import { GasMeter } from "./metering";
import VmImports from "./vm-imports";

describe("vm-imports", () => {
	it("should only add allowed WASI imports", () => {
		const vmImports = new VmImports(
			new GasMeter(1n),
			"1",
			{
				args: [],
				binary: new Uint8Array(),
				envs: {},
				allowedImports: ["args_get"],
			},
			new SharedArrayBuffer(1),
		);

		const finalImports = vmImports.getImports({
			wasi_snapshot_preview1: {
				args_get: () => {},
				function_that_could_harm: () => {},
			},
		});

		expect(
			finalImports.wasi_snapshot_preview1.function_that_could_harm,
		).toBeUndefined();
		expect(finalImports.wasi_snapshot_preview1.args_get).toBeDefined();
	});

	it("should only add allowed WASI imports even on multiple versions", () => {
		const vmImports = new VmImports(
			new GasMeter(1n),
			"1",
			{
				args: [],
				binary: new Uint8Array(),
				envs: {},
				allowedImports: ["args_get"],
			},
			new SharedArrayBuffer(1),
		);

		const finalImports = vmImports.getImports({
			wasi_snapshot_preview1: {
				args_get: () => {},
				function_that_could_harm: () => {},
			},
			some_other_wasi_version: {
				args_get: () => {},
				function_that_could_harm: () => {},
			},
		});

		expect(
			finalImports.wasi_snapshot_preview1.function_that_could_harm,
		).toBeUndefined();
		expect(finalImports.wasi_snapshot_preview1.args_get).toBeDefined();

		expect(
			finalImports.some_other_wasi_version.function_that_could_harm,
		).toBeUndefined();
		expect(finalImports.some_other_wasi_version.args_get).toBeDefined();
	});

	it("Empty array should disallow all imports", () => {
		const vmImports = new VmImports(
			new GasMeter(1n),
			"1",
			{
				args: [],
				binary: new Uint8Array(),
				envs: {},
				allowedImports: [],
			},
			new SharedArrayBuffer(1),
		);

		const finalImports = vmImports.getImports({
			wasi_snapshot_preview1: {
				args_get: () => {},
				function_that_could_harm: () => {},
			},
		});

		expect(
			finalImports.wasi_snapshot_preview1.function_that_could_harm,
		).toBeUndefined();
		expect(finalImports.wasi_snapshot_preview1.args_get).toBeUndefined();
	});

	it("undefined allowedImports should allow all", () => {
		const vmImports = new VmImports(
			new GasMeter(1n),
			"1",
			{
				args: [],
				binary: new Uint8Array(),
				envs: {},
			},
			new SharedArrayBuffer(1),
		);

		const finalImports = vmImports.getImports({
			wasi_snapshot_preview1: {
				args_get: () => {},
				environ_get: () => {},
			},
		});

		expect(finalImports.wasi_snapshot_preview1.environ_get).toBeDefined();
		expect(finalImports.wasi_snapshot_preview1.args_get).toBeDefined();
	});
});
