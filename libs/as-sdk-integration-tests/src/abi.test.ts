import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { testOracleProgramExecution } from "@seda/dev-tools";
import { decodeAbiParameters, encodeAbiParameters } from "viem";

const oracleProgram = await readFile(
	"dist/libs/as-sdk-integration-tests/debug.wasm",
);

interface AbiType<T> {
	type: string;
	value: T;
}

// TODO: Will be used later to test all abi values at once
function getAllAbiTypes() {
	const intTypes: AbiType<number>[] = [
		"int8",
		"int16",
		"int32",
		"int64",
		"int128",
		"int160",
		"int256",
	].map((type, i) => ({ type, value: i }));
	const uintTypes: AbiType<number>[] = intTypes.map((t, index) => ({
		type: `u${t.type}`,
		value: t.value + index,
	}));
	const addressTypes: AbiType<string>[] = [
		{ type: "address", value: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
	];
	const boolTypes: AbiType<boolean>[] = [{ type: "bool", value: true }];
	const bytesTypes: AbiType<string>[] = new Array(32)
		.fill(0)
		.map((v, index) => ({
			type: `bytes${index + 1}`,
			value: `0x${Buffer.alloc(index + 1)
				.fill(index + 1)
				.toString("hex")}`,
		}));
	const stringTypes: AbiType<string>[] = [{ type: "string", value: "wagmi" }];
	const dynamicByteTypes: AbiType<string>[] = [
		{
			type: "bytes",
			value: `0x${Buffer.alloc(123).fill(123).toString("hex")}`,
		},
	];
	const allAbiTypes = [
		...intTypes,
		...uintTypes,
		...addressTypes,
		...boolTypes,
		...bytesTypes,
		...stringTypes,
		...dynamicByteTypes,
	];
	const allAbiTypeNames = allAbiTypes.map((x) => x.type);
	const abi = allAbiTypes.map((value, index) => ({
		name: `x${index}`,
		type: value.type,
	}));
	const encodedValues = encodeAbiParameters(
		abi,
		allAbiTypes.map((v) => v.value),
	);
}

describe("abi", () => {
	describe("abiDecode", () => {
		it("should be able to decode an abi encoded bytes string", async () => {
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testAbiDecode"),
			);

			expect(result.exitCode).toBe(0);
		});

		it("should be able to decode abi encoded array of items", async () => {
			const encoded = encodeAbiParameters(
				[{ name: "x", type: "uint256[]" }],
				[[2n, 10n, 4n]],
			);
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from(`testAbiDecodeArrays:${encoded}`),
			);

			expect(result.stdout).toBe("[2, 10, 4]\n");
			expect(result.exitCode).toBe(0);
		});

		it("should be able to decode abi encoded array of strings", async () => {
			const encoded = encodeAbiParameters(
				[{ name: "x", type: "string[]" }],
				[["h", "ellw", "ops"]],
			);
			
			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from(`testAbiStringDecodeArrays:${encoded}`),
			);

			console.log("[DEBUG]: result ::: ", result);

			expect(result.stdout).toBe("[2, 10, 4]\n");
			expect(result.exitCode).toBe(1);
		});
	});

	describe("abiEncode", () => {
		it("should be able to encode an abi decoded bytes string", async () => {
			const intTypes: AbiType<number>[] = [
				"int8",
				"int16",
				"int32",
				"int64",
				"int128",
				"int160",
				"int256",
			].map((type, i) => ({ type, value: i }));
			const uintTypes: AbiType<number>[] = intTypes.map((t, index) => ({
				type: `u${t.type}`,
				value: t.value + index,
			}));
			const addressTypes: AbiType<string>[] = [
				{
					type: "address",
					value: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
				},
			];
			const boolTypes: AbiType<boolean>[] = [{ type: "bool", value: true }];
			const bytesTypes: AbiType<Buffer>[] = new Array(32)
				.fill(0)
				.map((v, index) => ({
					type: `bytes${index + 1}`,
					value: Buffer.alloc(index + 1).fill(index + 1),
				}));
			const allAbiTypes = ["address", "bool"];

			const result = await testOracleProgramExecution(
				oracleProgram,
				Buffer.from("testAbiEncode"),
			);

			expect(result.exitCode).toBe(0);
		});
	});
});
