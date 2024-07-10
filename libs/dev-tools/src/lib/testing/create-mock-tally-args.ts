import { createMockReveals, type RevealInput } from './create-mock-reveal';

type ReportInput = RevealInput & {
  /**
   * Whether the result was deemed to be in consensus or not in the filtering phase.
   */
  inConsensus: boolean;
};

export function createMockTallyArgs(tallyInputs: Buffer, reports: ReportInput[]): string[] {
  const reveals = createMockReveals(reports);
  // Encode booleans with 0 for true and 1 for false.
  const consensus = reports.map((report) => report.inConsensus ? 0 : 1);

  return [tallyInputs.toString('hex'), JSON.stringify(reveals), JSON.stringify(consensus)];
}
