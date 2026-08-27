import type { VmResult } from "../vm.js";
import type { VmAction } from "./vm-actions.js";
import type { VmCallData } from "./vm-call-data.js";

export enum WorkerMessageType {
	VmCall = "VmCall",
	VmResult = "VmResult",
	VmActionResultBuffer = "VmActionResultBuffer",
	VmActionExecute = "VmActionExecute",
}

export interface VmCallWorkerMessage {
	callData: VmCallData;
	processId: string;
	notifierBuffer: SharedArrayBuffer;
	type: WorkerMessageType.VmCall;
}

export interface VmResultWorkerMessage {
	result: VmResult;
	processId: string;
	type: WorkerMessageType.VmResult;
}

export interface VmActionResultBufferMessage {
	buffer: SharedArrayBuffer;
	processId: string;
	type: WorkerMessageType.VmActionResultBuffer;
}

export interface VmActionExecuteMessage {
	action: VmAction;
	processId: string;
	type: WorkerMessageType.VmActionExecute;
}

export type WorkerMessage =
	| VmCallWorkerMessage
	| VmResultWorkerMessage
	| VmActionResultBufferMessage
	| VmActionExecuteMessage;
