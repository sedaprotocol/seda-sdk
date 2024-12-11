import { abiDecode, Bytes, OracleProgram, Process, u256 } from "../../as-sdk/assembly";

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