import { createHash } from "node:crypto";
import type { VmCallData } from "../vm";

export function createProcessId(callData: VmCallData): string {
  const hasher = createHash('sha256');
  const binary = new Uint8Array(callData.binary);
  hasher.update(binary);
  const binaryId = hasher.digest().toString('hex');

  return `${callData.args.join('-')}-${binaryId}`;
}
