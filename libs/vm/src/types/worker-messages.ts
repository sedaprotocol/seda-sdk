import { VmCallData, VmResult } from "../vm";

export enum WorkerMessageType {
  VmCall = "VmCall",
  VmResult = "VmResult",
}

export interface VmCallWorkerMessage {
  processId: string,
  callData: VmCallData,
  type: WorkerMessageType.VmCall,
}

export interface VmResultWorkerMessage {
  processId: string,
  result: VmResult,
  type: WorkerMessageType.VmResult,
}

export type WorkerMessage = VmCallWorkerMessage | VmResultWorkerMessage;
