import { abiDecode, Bytes, Console, OracleProgram, Process, u256 } from "../../as-sdk/assembly";
import { abiEncode } from "../../as-sdk/assembly/abi";

const allTypesEncoded = "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000000000010100000000000000000000000000000000000000000000000000000000000000020200000000000000000000000000000000000000000000000000000000000003030300000000000000000000000000000000000000000000000000000000000404040400000000000000000000000000000000000000000000000000000000050505050500000000000000000000000000000000000000000000000000000006060606060600000000000000000000000000000000000000000000000000000707070707070700000000000000000000000000000000000000000000000000080808080808080800000000000000000000000000000000000000000000000009090909090909090900000000000000000000000000000000000000000000000a0a0a0a0a0a0a0a0a0a000000000000000000000000000000000000000000000b0b0b0b0b0b0b0b0b0b0b0000000000000000000000000000000000000000000c0c0c0c0c0c0c0c0c0c0c0c00000000000000000000000000000000000000000d0d0d0d0d0d0d0d0d0d0d0d0d000000000000000000000000000000000000000e0e0e0e0e0e0e0e0e0e0e0e0e0e0000000000000000000000000000000000000f0f0f0f0f0f0f0f0f0f0f0f0f0f0f000000000000000000000000000000000010101010101010101010101010101010000000000000000000000000000000001111111111111111111111111111111111000000000000000000000000000000121212121212121212121212121212121212000000000000000000000000000013131313131313131313131313131313131313000000000000000000000000001414141414141414141414141414141414141414000000000000000000000000151515151515151515151515151515151515151515000000000000000000000016161616161616161616161616161616161616161616000000000000000000001717171717171717171717171717171717171717171717000000000000000000181818181818181818181818181818181818181818181818000000000000000019191919191919191919191919191919191919191919191919000000000000001a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a0000000000001b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b00000000001c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c000000001d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d0000001e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e00001f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f0020202020202020202020202020202020202020202020202020202020202020200000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000068000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b0000000000";
const abi = [
    "int8", "int16", "int32", "int64", "int128", "int160", "int256", "uint8", "uint16", "uint32", "uint64",
    "uint128", "uint160", "uint256", "address", "bool", "bytes1", "bytes2", "bytes3", "bytes4", "bytes5",
    "bytes6", "bytes7", "bytes8", "bytes9", "bytes10", "bytes11", "bytes12", "bytes13", "bytes14", "bytes15",
    "bytes16", "bytes17", "bytes18", "bytes19", "bytes20", "bytes21", "bytes22", "bytes23", "bytes24",
    "bytes25", "bytes26", "bytes27", "bytes28", "bytes29", "bytes30", "bytes31", "bytes32", "string",
    "bytes"
];

export class TestAbiDecode extends OracleProgram {
    execution(): void {
        const abiBytes = Bytes.fromHexString("0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000");
        const output = abiDecode(["string", "uint", "bool"], abiBytes);

        assert(output[0].toUtf8String() === "wagmi", "[0] should be wagmi");
        assert(output[1].toU256(true) === u256.fromU32(420), "[1] should be 420");
        assert(output[2].toBool() === true, "[2] should be true");

        Process.success(Bytes.empty());
    }
}

export class TestAbiEncode extends OracleProgram {
    execution(): void {
        const input = "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006e6168617573646867617369756764757973676761736964756764736179676473617579676473617964736167757961646775796461677961647375676473617579676461737579676461737579646773617579676173647579646773617975647361676173756479677573616479000000000000000000000000000000000000";
        const abiBytes = Bytes.fromHexString(input);
        const decoded = abiDecode(["string"], abiBytes);

        const result = abiEncode(["string"], decoded);

        const test = abiEncode(["string", "bool", "uint"], [
            Bytes.fromUtf8String("wooohooo"),
            Bytes.fromBool(true),
            Bytes.fromNumber<u32>(18, true),
        ]);

        assert(input === "0x" + result.toHexString(), "Encoded to the wrong string");

        Process.success(Bytes.empty());
    }
}