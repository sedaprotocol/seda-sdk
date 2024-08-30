import { JSON } from "json-as";
import { Tally, Process, Bytes } from "../../as-sdk/assembly";

export function testTallyVmReveals(): void {
  const reveals = Tally.getReveals();

  Process.success(Bytes.fromString(JSON.stringify(reveals)));
}

export function testTallyVmRevealsFiltered(): void {
  const reveals = Tally.getConsensusReveals();

  Process.success(Bytes.fromString(JSON.stringify(reveals)));
}
