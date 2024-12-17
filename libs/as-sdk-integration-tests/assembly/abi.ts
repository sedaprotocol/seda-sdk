import {
	Bytes,
	Console,
	OracleProgram,
	Process,
	abiDecode,
	u256,
} from "../../as-sdk/assembly";
import { AbiValue, abiEncode } from "../../as-sdk/assembly/abi";

export class TestAbiDecode extends OracleProgram {
	execution(): void {
		const abiBytes = Bytes.fromHexString(
			"0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000",
		);
		const output = abiDecode(["string", "uint", "bool"], abiBytes);

		assert(output[0].toUtf8String() === "wagmi", "[0] should be wagmi");
		assert(output[1].toU256(true) === u256.fromU32(420), "[1] should be 420");
		assert(output[2].toBool() === true, "[2] should be true");

		Process.success(Bytes.empty());
	}
}

export class TestAbiDecodeArrays extends OracleProgram {
	execution(): void {
		const input = Bytes.fromHexString(
			Process.getInputs().slice(20).toUtf8String(),
		);
		const output = abiDecode(["uint256[]"], input);
		const numbers: u256[] = output
			.at(0)
			.asArray()
			.map((v: Bytes) => v.toU256(true));

		Console.log(numbers);

		Process.success(Bytes.empty());
	}
}

export class TestAbiStringDecodeArrays extends OracleProgram {
	execution(): void {
		const input = Bytes.fromHexString(
			Process.getInputs().slice(26).toUtf8String(),
		);
		const output = abiDecode(["string[]"], input);
		const strings: string[] = output
			.at(0)
			.asArray()
			.map((v: Bytes) => v.toUtf8String());

		Console.log(strings);

		Process.success(Bytes.empty());
	}
}

export class TestAbiEncode extends OracleProgram {
	execution(): void {
		const input =
			"0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006e6168617573646867617369756764757973676761736964756764736179676473617579676473617964736167757961646775796461677961647375676473617579676461737579676461737579646773617579676173647579646773617975647361676173756479677573616479000000000000000000000000000000000000";
		const abiBytes = Bytes.fromHexString(input);
		const decoded = abiDecode(["string"], abiBytes);

		const result = abiEncode(["string"], AbiValue.arrayToBytes(decoded));

		const test = abiEncode(
			["string", "bool", "uint"],
			[
				AbiValue.fromUtf8String("wooohooo"),
				AbiValue.fromBool(true),
				AbiValue.fromNumber<u32>(18, true),
			],
		);

		assert(
			input === `0x${result.toHexString()}`,
			"Encoded to the wrong string",
		);

		Process.success(Bytes.empty());
	}
}
