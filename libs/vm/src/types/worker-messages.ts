import type { VmCallData, VmResult } from "../vm";
import type { VmAction } from "./vm-actions";

export enum WorkerMessageType {
  VmCall = "VmCall",
  VmResult = "VmResult",
  VmActionResultBuffer = "VmActionResultBuffer",
  VmActionExecute = "VmActionExecute",
}

export interface VmCallWorkerMessage {
  callData: VmCallData,
  notifierBuffer: SharedArrayBuffer,
  type: WorkerMessageType.VmCall,
}

export interface VmResultWorkerMessage {
  result: VmResult,
  type: WorkerMessageType.VmResult,
}

export interface VmActionResultBufferMessage {
  buffer: SharedArrayBuffer,
  type: WorkerMessageType.VmActionResultBuffer,
}

export interface VmActionExecuteMessage {
  action: VmAction;
  type: WorkerMessageType.VmActionExecute;
}


export type WorkerMessage =
  | VmCallWorkerMessage
  | VmResultWorkerMessage
  | VmActionResultBufferMessage
  | VmActionExecuteMessage;
