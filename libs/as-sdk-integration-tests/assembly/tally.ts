import { JSON } from "json-as";
import { Bytes, OracleProgram, Process, Tally } from "../../as-sdk/assembly";

export class TestTallyVmReveals extends OracleProgram {
	tally(): void {
		const reveals = Tally.getReveals();

		Process.success(Bytes.fromUtf8String(JSON.stringify(reveals)));
	}
}

export class TestTallyVmRevealsFiltered extends OracleProgram {
	tally(): void {
		const reveals = Tally.getConsensusReveals();

		Process.success(Bytes.fromUtf8String(JSON.stringify(reveals)));
	}
}
