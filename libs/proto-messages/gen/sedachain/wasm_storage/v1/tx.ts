// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.178.0
//   protoc               unknown
// source: sedachain/wasm_storage/v1/tx.proto

/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { Params } from "./wasm_storage";

/** The request message for the StoreDataRequestWasm method. */
export interface MsgStoreDataRequestWasm {
  sender: string;
  wasm: Uint8Array;
}

/** The response message for the StoreDataRequestWasm method. */
export interface MsgStoreDataRequestWasmResponse {
  hash: string;
}

/** The request message for the StoreExecutorWasm method. */
export interface MsgStoreExecutorWasm {
  sender: string;
  wasm: Uint8Array;
}

/** The response message for the StoreExecutorWasm method. */
export interface MsgStoreExecutorWasmResponse {
  hash: string;
}

/** The request message for the InstantiateCoreContract method. */
export interface MsgInstantiateCoreContract {
  sender: string;
  admin: string;
  codeId: number;
  label: string;
  msg: Uint8Array;
  funds: Coin[];
  salt: Uint8Array;
  fixMsg: boolean;
}

/** The response message for the InstantiateCoreContract method. */
export interface MsgInstantiateCoreContractResponse {
  contractAddress: string;
}

/** The request message for the UpdateParams method. */
export interface MsgUpdateParams {
  /**
   * authority is the address that controls the module (defaults to x/gov unless
   * overwritten).
   */
  authority: string;
  params: Params | undefined;
}

/** no data needs to be returned */
export interface MsgUpdateParamsResponse {
}

function createBaseMsgStoreDataRequestWasm(): MsgStoreDataRequestWasm {
  return { sender: "", wasm: new Uint8Array(0) };
}

export const MsgStoreDataRequestWasm = {
  encode(message: MsgStoreDataRequestWasm, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.wasm.length !== 0) {
      writer.uint32(18).bytes(message.wasm);
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
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      wasm: isSet(object.wasm) ? bytesFromBase64(object.wasm) : new Uint8Array(0),
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
    return obj;
  },

  create(base?: DeepPartial<MsgStoreDataRequestWasm>): MsgStoreDataRequestWasm {
    return MsgStoreDataRequestWasm.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgStoreDataRequestWasm>): MsgStoreDataRequestWasm {
    const message = createBaseMsgStoreDataRequestWasm();
    message.sender = object.sender ?? "";
    message.wasm = object.wasm ?? new Uint8Array(0);
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
    return { hash: isSet(object.hash) ? globalThis.String(object.hash) : "" };
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

function createBaseMsgStoreExecutorWasm(): MsgStoreExecutorWasm {
  return { sender: "", wasm: new Uint8Array(0) };
}

export const MsgStoreExecutorWasm = {
  encode(message: MsgStoreExecutorWasm, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.wasm.length !== 0) {
      writer.uint32(18).bytes(message.wasm);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgStoreExecutorWasm {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgStoreExecutorWasm();
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
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgStoreExecutorWasm {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      wasm: isSet(object.wasm) ? bytesFromBase64(object.wasm) : new Uint8Array(0),
    };
  },

  toJSON(message: MsgStoreExecutorWasm): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.wasm.length !== 0) {
      obj.wasm = base64FromBytes(message.wasm);
    }
    return obj;
  },

  create(base?: DeepPartial<MsgStoreExecutorWasm>): MsgStoreExecutorWasm {
    return MsgStoreExecutorWasm.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgStoreExecutorWasm>): MsgStoreExecutorWasm {
    const message = createBaseMsgStoreExecutorWasm();
    message.sender = object.sender ?? "";
    message.wasm = object.wasm ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMsgStoreExecutorWasmResponse(): MsgStoreExecutorWasmResponse {
  return { hash: "" };
}

export const MsgStoreExecutorWasmResponse = {
  encode(message: MsgStoreExecutorWasmResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgStoreExecutorWasmResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgStoreExecutorWasmResponse();
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

  fromJSON(object: any): MsgStoreExecutorWasmResponse {
    return { hash: isSet(object.hash) ? globalThis.String(object.hash) : "" };
  },

  toJSON(message: MsgStoreExecutorWasmResponse): unknown {
    const obj: any = {};
    if (message.hash !== "") {
      obj.hash = message.hash;
    }
    return obj;
  },

  create(base?: DeepPartial<MsgStoreExecutorWasmResponse>): MsgStoreExecutorWasmResponse {
    return MsgStoreExecutorWasmResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgStoreExecutorWasmResponse>): MsgStoreExecutorWasmResponse {
    const message = createBaseMsgStoreExecutorWasmResponse();
    message.hash = object.hash ?? "";
    return message;
  },
};

function createBaseMsgInstantiateCoreContract(): MsgInstantiateCoreContract {
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

export const MsgInstantiateCoreContract = {
  encode(message: MsgInstantiateCoreContract, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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
    if (message.fixMsg !== false) {
      writer.uint32(64).bool(message.fixMsg);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgInstantiateCoreContract {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgInstantiateCoreContract();
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

  fromJSON(object: any): MsgInstantiateCoreContract {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      admin: isSet(object.admin) ? globalThis.String(object.admin) : "",
      codeId: isSet(object.codeId) ? globalThis.Number(object.codeId) : 0,
      label: isSet(object.label) ? globalThis.String(object.label) : "",
      msg: isSet(object.msg) ? bytesFromBase64(object.msg) : new Uint8Array(0),
      funds: globalThis.Array.isArray(object?.funds) ? object.funds.map((e: any) => Coin.fromJSON(e)) : [],
      salt: isSet(object.salt) ? bytesFromBase64(object.salt) : new Uint8Array(0),
      fixMsg: isSet(object.fixMsg) ? globalThis.Boolean(object.fixMsg) : false,
    };
  },

  toJSON(message: MsgInstantiateCoreContract): unknown {
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
    if (message.fixMsg !== false) {
      obj.fixMsg = message.fixMsg;
    }
    return obj;
  },

  create(base?: DeepPartial<MsgInstantiateCoreContract>): MsgInstantiateCoreContract {
    return MsgInstantiateCoreContract.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgInstantiateCoreContract>): MsgInstantiateCoreContract {
    const message = createBaseMsgInstantiateCoreContract();
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

function createBaseMsgInstantiateCoreContractResponse(): MsgInstantiateCoreContractResponse {
  return { contractAddress: "" };
}

export const MsgInstantiateCoreContractResponse = {
  encode(message: MsgInstantiateCoreContractResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contractAddress !== "") {
      writer.uint32(10).string(message.contractAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgInstantiateCoreContractResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgInstantiateCoreContractResponse();
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

  fromJSON(object: any): MsgInstantiateCoreContractResponse {
    return { contractAddress: isSet(object.contractAddress) ? globalThis.String(object.contractAddress) : "" };
  },

  toJSON(message: MsgInstantiateCoreContractResponse): unknown {
    const obj: any = {};
    if (message.contractAddress !== "") {
      obj.contractAddress = message.contractAddress;
    }
    return obj;
  },

  create(base?: DeepPartial<MsgInstantiateCoreContractResponse>): MsgInstantiateCoreContractResponse {
    return MsgInstantiateCoreContractResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgInstantiateCoreContractResponse>): MsgInstantiateCoreContractResponse {
    const message = createBaseMsgInstantiateCoreContractResponse();
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
};

function createBaseMsgUpdateParams(): MsgUpdateParams {
  return { authority: "", params: undefined };
}

export const MsgUpdateParams = {
  encode(message: MsgUpdateParams, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateParams {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authority = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.params = Params.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateParams {
    return {
      authority: isSet(object.authority) ? globalThis.String(object.authority) : "",
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
    };
  },

  toJSON(message: MsgUpdateParams): unknown {
    const obj: any = {};
    if (message.authority !== "") {
      obj.authority = message.authority;
    }
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    return obj;
  },

  create(base?: DeepPartial<MsgUpdateParams>): MsgUpdateParams {
    return MsgUpdateParams.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgUpdateParams>): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    message.authority = object.authority ?? "";
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    return message;
  },
};

function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}

export const MsgUpdateParamsResponse = {
  encode(_: MsgUpdateParamsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateParamsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgUpdateParamsResponse {
    return {};
  },

  toJSON(_: MsgUpdateParamsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<MsgUpdateParamsResponse>): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<MsgUpdateParamsResponse>): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
};

/** Msg service defines the wasm-storage tx gRPC methods. */
export interface Msg {
  /** StoreDataRequestWasm stores a data request wasm. */
  StoreDataRequestWasm(request: MsgStoreDataRequestWasm): Promise<MsgStoreDataRequestWasmResponse>;
  /** StoreExecutorWasm stores an executor wasm. */
  StoreExecutorWasm(request: MsgStoreExecutorWasm): Promise<MsgStoreExecutorWasmResponse>;
  /**
   * InstantiateCoreContract instantiates the Core Contract and registers its
   * address.
   */
  InstantiateCoreContract(request: MsgInstantiateCoreContract): Promise<MsgInstantiateCoreContractResponse>;
  /** The UpdateParams method updates the module's parameters. */
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
}

export const MsgServiceName = "sedachain.wasm_storage.v1.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.StoreDataRequestWasm = this.StoreDataRequestWasm.bind(this);
    this.StoreExecutorWasm = this.StoreExecutorWasm.bind(this);
    this.InstantiateCoreContract = this.InstantiateCoreContract.bind(this);
    this.UpdateParams = this.UpdateParams.bind(this);
  }
  StoreDataRequestWasm(request: MsgStoreDataRequestWasm): Promise<MsgStoreDataRequestWasmResponse> {
    const data = MsgStoreDataRequestWasm.encode(request).finish();
    const promise = this.rpc.request(this.service, "StoreDataRequestWasm", data);
    return promise.then((data) => MsgStoreDataRequestWasmResponse.decode(_m0.Reader.create(data)));
  }

  StoreExecutorWasm(request: MsgStoreExecutorWasm): Promise<MsgStoreExecutorWasmResponse> {
    const data = MsgStoreExecutorWasm.encode(request).finish();
    const promise = this.rpc.request(this.service, "StoreExecutorWasm", data);
    return promise.then((data) => MsgStoreExecutorWasmResponse.decode(_m0.Reader.create(data)));
  }

  InstantiateCoreContract(request: MsgInstantiateCoreContract): Promise<MsgInstantiateCoreContractResponse> {
    const data = MsgInstantiateCoreContract.encode(request).finish();
    const promise = this.rpc.request(this.service, "InstantiateCoreContract", data);
    return promise.then((data) => MsgInstantiateCoreContractResponse.decode(_m0.Reader.create(data)));
  }

  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse> {
    const data = MsgUpdateParams.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateParams", data);
    return promise.then((data) => MsgUpdateParamsResponse.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  if (long.lt(globalThis.Number.MIN_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
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
