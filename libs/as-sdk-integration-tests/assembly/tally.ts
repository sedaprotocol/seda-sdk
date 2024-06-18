import { JSON } from "json-as";
import { Tally, Process } from "../../as-sdk/assembly";

export function testTallyVmReveals(): void {
  const reveals = Tally.getReveals();

  Process.exit_with_message(0, JSON.stringify(reveals));
}

export function testTallyVmRevealsFiltered(): void {
  const reveals = Tally.getConsensusReveals();

  Process.exit_with_message(0, JSON.stringify(reveals));
}
