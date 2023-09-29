/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { Coin } from "../../../cosmos/base/v1beta1/coin.js";
import { WasmType, wasmTypeFromJSON, wasmTypeToJSON } from "./wasm_storage.js";

export const protobufPackage = "sedachain.wasm_storage.v1";

export interface MsgStoreDataRequestWasm {
  sender: string;
  wasm: Uint8Array;
  wasmType: WasmType;
}

export interface MsgStoreDataRequestWasmResponse {
  hash: string;
}

export interface MsgStoreOverlayWasm {
  sender: string;
  wasm: Uint8Array;
  wasmType: WasmType;
}

export interface MsgStoreOverlayWasmResponse {
  hash: string;
}

export interface MsgInstantiateAndRegisterProxyContract {
  sender: string;
  admin: string;
  codeId: number;
  label: string;
  msg: Uint8Array;
  funds: Coin[];
  salt: Uint8Array;
  fixMsg: boolean;
}

export interface MsgInstantiateAndRegisterProxyContractResponse {
  contractAddress: string;
}

function createBaseMsgStoreDataRequestWasm(): MsgStoreDataRequestWasm {
  return { sender: "", wasm: new Uint8Array(0), wasmType: 0 };
}

export const MsgStoreDataRequestWasm = {
  encode(message: MsgStoreDataRequestWasm, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.wasm.length !== 0) {
      writer.uint32(18).bytes(message.wasm);
    }
    if (message.wasmType !== 0) {
      writer.uint32(24).int32(message.wasmType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgStoreDataRequestWasm {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgStoreDataRequestWasm();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.wasm = reader.bytes();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.wasmType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgStoreDataRequestWasm {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      wasm: isSet(object.wasm) ? bytesFromBase64(object.wasm) : new Uint8Array(0),
      wasmType: isSet(object.wasmType) ? wasmTypeFromJSON(object.wasmType) : 0,
    };
  },

  toJSON(message: MsgStoreDataRequestWasm): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.wasm.length !== 0) {
      obj.wasm = base64FromBytes(message.wasm);
    }
    if (message.wasmType !== 0) {
      obj.wasmType = wasmTypeToJSON(message.wasmType);
    }
    return obj;
  },

  create(base?: DeepPartial<MsgStoreDataRequestWasm>): MsgStoreDataRequestWasm {
    return MsgStoreDataRequestWasm.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgStoreDataRequestWasm>): MsgStoreDataRequestWasm {
    const message = createBaseMsgStoreDataRequestWasm();
    message.sender = object.sender ?? "";
    message.wasm = object.wasm ?? new Uint8Array(0);
    message.wasmType = object.wasmType ?? 0;
    return message;
  },
};

function createBaseMsgStoreDataRequestWasmResponse(): MsgStoreDataRequestWasmResponse {
  return { hash: "" };
}

export const MsgStoreDataRequestWasmResponse = {
  encode(message: MsgStoreDataRequestWasmResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgStoreDataRequestWasmResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgStoreDataRequestWasmResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.hash = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgStoreDataRequestWasmResponse {
    return { hash: isSet(object.hash) ? String(object.hash) : "" };
  },

  toJSON(message: MsgStoreDataRequestWasmResponse): unknown {
    const obj: any = {};
    if (message.hash !== "") {
      obj.hash = message.hash;
    }
    return obj;
  },

  create(base?: DeepPartial<MsgStoreDataRequestWasmResponse>): MsgStoreDataRequestWasmResponse {
    return MsgStoreDataRequestWasmResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgStoreDataRequestWasmResponse>): MsgStoreDataRequestWasmResponse {
    const message = createBaseMsgStoreDataRequestWasmResponse();
    message.hash = object.hash ?? "";
    return message;
  },
};

function createBaseMsgStoreOverlayWasm(): MsgStoreOverlayWasm {
  return { sender: "", wasm: new Uint8Array(0), wasmType: 0 };
}

export const MsgStoreOverlayWasm = {
  encode(message: MsgStoreOverlayWasm, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.wasm.length !== 0) {
      writer.uint32(18).bytes(message.wasm);
    }
    if (message.wasmType !== 0) {
      writer.uint32(24).int32(message.wasmType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgStoreOverlayWasm {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgStoreOverlayWasm();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.wasm = reader.bytes();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.wasmType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgStoreOverlayWasm {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      wasm: isSet(object.wasm) ? bytesFromBase64(object.wasm) : new Uint8Array(0),
      wasmType: isSet(object.wasmType) ? wasmTypeFromJSON(object.wasmType) : 0,
    };
  },

  toJSON(message: MsgStoreOverlayWasm): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.wasm.length !== 0) {
      obj.wasm = base64FromBytes(message.wasm);
    }
    if (message.wasmType !== 0) {
      obj.wasmType = wasmTypeToJSON(message.wasmType);
    }
    return obj;
  },

  create(base?: DeepPartial<MsgStoreOverlayWasm>): MsgStoreOverlayWasm {
    return MsgStoreOverlayWasm.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgStoreOverlayWasm>): MsgStoreOverlayWasm {
    const message = createBaseMsgStoreOverlayWasm();
    message.sender = object.sender ?? "";
    message.wasm = object.wasm ?? new Uint8Array(0);
    message.wasmType = object.wasmType ?? 0;
    return message;
  },
};

function createBaseMsgStoreOverlayWasmResponse(): MsgStoreOverlayWasmResponse {
  return { hash: "" };
}

export const MsgStoreOverlayWasmResponse = {
  encode(message: MsgStoreOverlayWasmResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgStoreOverlayWasmResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgStoreOverlayWasmResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.hash = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgStoreOverlayWasmResponse {
    return { hash: isSet(object.hash) ? String(object.hash) : "" };
  },

  toJSON(message: MsgStoreOverlayWasmResponse): unknown {
    const obj: any = {};
    if (message.hash !== "") {
      obj.hash = message.hash;
    }
    return obj;
  },

  create(base?: DeepPartial<MsgStoreOverlayWasmResponse>): MsgStoreOverlayWasmResponse {
    return MsgStoreOverlayWasmResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgStoreOverlayWasmResponse>): MsgStoreOverlayWasmResponse {
    const message = createBaseMsgStoreOverlayWasmResponse();
    message.hash = object.hash ?? "";
    return message;
  },
};

function createBaseMsgInstantiateAndRegisterProxyContract(): MsgInstantiateAndRegisterProxyContract {
  return {
    sender: "",
    admin: "",
    codeId: 0,
    label: "",
    msg: new Uint8Array(0),
    funds: [],
    salt: new Uint8Array(0),
    fixMsg: false,
  };
}

export const MsgInstantiateAndRegisterProxyContract = {
  encode(message: MsgInstantiateAndRegisterProxyContract, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.admin !== "") {
      writer.uint32(18).string(message.admin);
    }
    if (message.codeId !== 0) {
      writer.uint32(24).uint64(message.codeId);
    }
    if (message.label !== "") {
      writer.uint32(34).string(message.label);
    }
    if (message.msg.length !== 0) {
      writer.uint32(42).bytes(message.msg);
    }
    for (const v of message.funds) {
      Coin.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.salt.length !== 0) {
      writer.uint32(58).bytes(message.salt);
    }
    if (message.fixMsg === true) {
      writer.uint32(64).bool(message.fixMsg);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgInstantiateAndRegisterProxyContract {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgInstantiateAndRegisterProxyContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.admin = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.codeId = longToNumber(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.label = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.msg = reader.bytes();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.funds.push(Coin.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.salt = reader.bytes();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.fixMsg = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgInstantiateAndRegisterProxyContract {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      admin: isSet(object.admin) ? String(object.admin) : "",
      codeId: isSet(object.codeId) ? Number(object.codeId) : 0,
      label: isSet(object.label) ? String(object.label) : "",
      msg: isSet(object.msg) ? bytesFromBase64(object.msg) : new Uint8Array(0),
      funds: Array.isArray(object?.funds) ? object.funds.map((e: any) => Coin.fromJSON(e)) : [],
      salt: isSet(object.salt) ? bytesFromBase64(object.salt) : new Uint8Array(0),
      fixMsg: isSet(object.fixMsg) ? Boolean(object.fixMsg) : false,
    };
  },

  toJSON(message: MsgInstantiateAndRegisterProxyContract): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.admin !== "") {
      obj.admin = message.admin;
    }
    if (message.codeId !== 0) {
      obj.codeId = Math.round(message.codeId);
    }
    if (message.label !== "") {
      obj.label = message.label;
    }
    if (message.msg.length !== 0) {
      obj.msg = base64FromBytes(message.msg);
    }
    if (message.funds?.length) {
      obj.funds = message.funds.map((e) => Coin.toJSON(e));
    }
    if (message.salt.length !== 0) {
      obj.salt = base64FromBytes(message.salt);
    }
    if (message.fixMsg === true) {
      obj.fixMsg = message.fixMsg;
    }
    return obj;
  },

  create(base?: DeepPartial<MsgInstantiateAndRegisterProxyContract>): MsgInstantiateAndRegisterProxyContract {
    return MsgInstantiateAndRegisterProxyContract.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgInstantiateAndRegisterProxyContract>): MsgInstantiateAndRegisterProxyContract {
    const message = createBaseMsgInstantiateAndRegisterProxyContract();
    message.sender = object.sender ?? "";
    message.admin = object.admin ?? "";
    message.codeId = object.codeId ?? 0;
    message.label = object.label ?? "";
    message.msg = object.msg ?? new Uint8Array(0);
    message.funds = object.funds?.map((e) => Coin.fromPartial(e)) || [];
    message.salt = object.salt ?? new Uint8Array(0);
    message.fixMsg = object.fixMsg ?? false;
    return message;
  },
};

function createBaseMsgInstantiateAndRegisterProxyContractResponse(): MsgInstantiateAndRegisterProxyContractResponse {
  return { contractAddress: "" };
}

export const MsgInstantiateAndRegisterProxyContractResponse = {
  encode(
    message: MsgInstantiateAndRegisterProxyContractResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.contractAddress !== "") {
      writer.uint32(10).string(message.contractAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgInstantiateAndRegisterProxyContractResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgInstantiateAndRegisterProxyContractResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.contractAddress = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgInstantiateAndRegisterProxyContractResponse {
    return { contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "" };
  },

  toJSON(message: MsgInstantiateAndRegisterProxyContractResponse): unknown {
    const obj: any = {};
    if (message.contractAddress !== "") {
      obj.contractAddress = message.contractAddress;
    }
    return obj;
  },

  create(
    base?: DeepPartial<MsgInstantiateAndRegisterProxyContractResponse>,
  ): MsgInstantiateAndRegisterProxyContractResponse {
    return MsgInstantiateAndRegisterProxyContractResponse.fromPartial(base ?? {});
  },
  fromPartial(
    object: DeepPartial<MsgInstantiateAndRegisterProxyContractResponse>,
  ): MsgInstantiateAndRegisterProxyContractResponse {
    const message = createBaseMsgInstantiateAndRegisterProxyContractResponse();
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
};

export interface Msg {
  StoreDataRequestWasm(request: MsgStoreDataRequestWasm): Promise<MsgStoreDataRequestWasmResponse>;
  StoreOverlayWasm(request: MsgStoreOverlayWasm): Promise<MsgStoreOverlayWasmResponse>;
  InstantiateAndRegisterProxyContract(
    request: MsgInstantiateAndRegisterProxyContract,
  ): Promise<MsgInstantiateAndRegisterProxyContractResponse>;
}

export const MsgServiceName = "sedachain.wasm_storage.v1.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.StoreDataRequestWasm = this.StoreDataRequestWasm.bind(this);
    this.StoreOverlayWasm = this.StoreOverlayWasm.bind(this);
    this.InstantiateAndRegisterProxyContract = this.InstantiateAndRegisterProxyContract.bind(this);
  }
  StoreDataRequestWasm(request: MsgStoreDataRequestWasm): Promise<MsgStoreDataRequestWasmResponse> {
    const data = MsgStoreDataRequestWasm.encode(request).finish();
    const promise = this.rpc.request(this.service, "StoreDataRequestWasm", data);
    return promise.then((data) => MsgStoreDataRequestWasmResponse.decode(_m0.Reader.create(data)));
  }

  StoreOverlayWasm(request: MsgStoreOverlayWasm): Promise<MsgStoreOverlayWasmResponse> {
    const data = MsgStoreOverlayWasm.encode(request).finish();
    const promise = this.rpc.request(this.service, "StoreOverlayWasm", data);
    return promise.then((data) => MsgStoreOverlayWasmResponse.decode(_m0.Reader.create(data)));
  }

  InstantiateAndRegisterProxyContract(
    request: MsgInstantiateAndRegisterProxyContract,
  ): Promise<MsgInstantiateAndRegisterProxyContractResponse> {
    const data = MsgInstantiateAndRegisterProxyContract.encode(request).finish();
    const promise = this.rpc.request(this.service, "InstantiateAndRegisterProxyContract", data);
    return promise.then((data) => MsgInstantiateAndRegisterProxyContractResponse.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

declare const self: any | undefined;
declare const window: any | undefined;
declare const global: any | undefined;
const tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
