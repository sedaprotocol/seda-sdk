import { createMockReveals, type RevealInput } from './create-mock-reveal';

type ReportInput = RevealInput & {
  /**
   * Whether the result was deemed to be in consensus or not in the filtering phase.
   */
  inConsensus: boolean;
};

function encodeFunctionName(functionName: string) {
  const bytes = Buffer.from(new TextEncoder().encode(functionName));
  return bytes.toString('hex');
}

export function createMockTallyArgs(tallyInputs: string, reports: ReportInput[]): string[] {
  const reveals = createMockReveals(reports);
  // Encode booleans with 0 for true and 1 for false.
  const consensus = reports.map((report) => report.inConsensus ? 0 : 1);

  return [encodeFunctionName(tallyInputs), JSON.stringify(reveals), JSON.stringify(consensus)];
}
