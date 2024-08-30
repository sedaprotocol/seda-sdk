import { JSON } from 'json-as';
import { Tally, Process, Bytes, OracleProgram } from '../../as-sdk/assembly';

export class TestTallyVmReveals extends OracleProgram {
  tally(): void {
    const reveals = Tally.getReveals();

    Process.success(Bytes.fromString(JSON.stringify(reveals)));
  }
}

export class TestTallyVmRevealsFiltered extends OracleProgram {
  tally(): void {
    const reveals = Tally.getConsensusReveals();

    Process.success(Bytes.fromString(JSON.stringify(reveals)));
  }
}
