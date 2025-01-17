// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               unknown
// source: sedachain/data_proxy/v1/tx.proto

/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { Params } from "./data_proxy";

/** All data required for a new data proxy. */
export interface MsgRegisterDataProxy {
  /** admin_address is the address that can update the proxy config. */
  adminAddress: string;
  /**
   * payout_address defines the address to which the data proxy fees should be
   * transferred.
   */
  payoutAddress: string;
  /** fee defines the amount in aseda this data-proxy charges when utilised. */
  fee:
    | Coin
    | undefined;
  /** memo defines an optional string which is not used by the protocol. */
  memo: string;
  /**
   * hex encoded bytes as the expected flow already uses hex encoded bytes to go
   * from the CLI to the browser where the transaction is signed.
   */
  pubKey: string;
  /**
   * hex encoded bytes as the expected flow already uses hex encoded bytes to go
   * from the CLI to the browser where the transaction is signed.
   */
  signature: string;
}

/** No response required. */
export interface MsgRegisterDataProxyResponse {
}

/**
 * Allow updating memo and payout address instantly and/or scheduling a fee
 * update.
 */
export interface MsgEditDataProxy {
  sender: string;
  newPayoutAddress: string;
  newMemo: string;
  newFee:
    | Coin
    | undefined;
  /** 0 will default to the minimum delay configured in the params */
  feeUpdateDelay: number;
  /**
   * hex encoded bytes as the expected flow is users sending updates from the
   * browser
   */
  pubKey: string;
}

/** Allow transferring the admin role to a different address. */
export interface MsgTransferAdmin {
  sender: string;
  newAdminAddress: string;
  /**
   * hex encoded bytes as the expected flow is users sending updates from the
   * browser
   */
  pubKey: string;
}

/** No response required. */
export interface MsgTransferAdminResponse {
}

/** Returns the height after which the fee update will go into effect. */
export interface MsgEditDataProxyResponse {
  feeUpdateHeight: bigint;
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

/** No response required. */
export interface MsgUpdateParamsResponse {
}

function createBaseMsgRegisterDataProxy(): MsgRegisterDataProxy {
  return { adminAddress: "", payoutAddress: "", fee: undefined, memo: "", pubKey: "", signature: "" };
}

export const MsgRegisterDataProxy = {
  encode(message: MsgRegisterDataProxy, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.adminAddress !== "") {
      writer.uint32(10).string(message.adminAddress);
    }
    if (message.payoutAddress !== "") {
      writer.uint32(18).string(message.payoutAddress);
    }
    if (message.fee !== undefined) {
      Coin.encode(message.fee, writer.uint32(26).fork()).ldelim();
    }
    if (message.memo !== "") {
      writer.uint32(34).string(message.memo);
    }
    if (message.pubKey !== "") {
      writer.uint32(42).string(message.pubKey);
    }
    if (message.signature !== "") {
      writer.uint32(50).string(message.signature);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterDataProxy {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterDataProxy();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.adminAddress = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.payoutAddress = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.fee = Coin.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.memo = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.pubKey = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.signature = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterDataProxy {
    return {
      adminAddress: isSet(object.adminAddress) ? globalThis.String(object.adminAddress) : "",
      payoutAddress: isSet(object.payoutAddress) ? globalThis.String(object.payoutAddress) : "",
      fee: isSet(object.fee) ? Coin.fromJSON(object.fee) : undefined,
      memo: isSet(object.memo) ? globalThis.String(object.memo) : "",
      pubKey: isSet(object.pubKey) ? globalThis.String(object.pubKey) : "",
      signature: isSet(object.signature) ? globalThis.String(object.signature) : "",
    };
  },

  toJSON(message: MsgRegisterDataProxy): unknown {
    const obj: any = {};
    if (message.adminAddress !== "") {
      obj.adminAddress = message.adminAddress;
    }
    if (message.payoutAddress !== "") {
      obj.payoutAddress = message.payoutAddress;
    }
    if (message.fee !== undefined) {
      obj.fee = Coin.toJSON(message.fee);
    }
    if (message.memo !== "") {
      obj.memo = message.memo;
    }
    if (message.pubKey !== "") {
      obj.pubKey = message.pubKey;
    }
    if (message.signature !== "") {
      obj.signature = message.signature;
    }
    return obj;
  },

  create(base?: DeepPartial<MsgRegisterDataProxy>): MsgRegisterDataProxy {
    return MsgRegisterDataProxy.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgRegisterDataProxy>): MsgRegisterDataProxy {
    const message = createBaseMsgRegisterDataProxy();
    message.adminAddress = object.adminAddress ?? "";
    message.payoutAddress = object.payoutAddress ?? "";
    message.fee = (object.fee !== undefined && object.fee !== null) ? Coin.fromPartial(object.fee) : undefined;
    message.memo = object.memo ?? "";
    message.pubKey = object.pubKey ?? "";
    message.signature = object.signature ?? "";
    return message;
  },
};

function createBaseMsgRegisterDataProxyResponse(): MsgRegisterDataProxyResponse {
  return {};
}

export const MsgRegisterDataProxyResponse = {
  encode(_: MsgRegisterDataProxyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterDataProxyResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterDataProxyResponse();
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

  fromJSON(_: any): MsgRegisterDataProxyResponse {
    return {};
  },

  toJSON(_: MsgRegisterDataProxyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<MsgRegisterDataProxyResponse>): MsgRegisterDataProxyResponse {
    return MsgRegisterDataProxyResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<MsgRegisterDataProxyResponse>): MsgRegisterDataProxyResponse {
    const message = createBaseMsgRegisterDataProxyResponse();
    return message;
  },
};

function createBaseMsgEditDataProxy(): MsgEditDataProxy {
  return { sender: "", newPayoutAddress: "", newMemo: "", newFee: undefined, feeUpdateDelay: 0, pubKey: "" };
}

export const MsgEditDataProxy = {
  encode(message: MsgEditDataProxy, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.newPayoutAddress !== "") {
      writer.uint32(18).string(message.newPayoutAddress);
    }
    if (message.newMemo !== "") {
      writer.uint32(26).string(message.newMemo);
    }
    if (message.newFee !== undefined) {
      Coin.encode(message.newFee, writer.uint32(34).fork()).ldelim();
    }
    if (message.feeUpdateDelay !== 0) {
      writer.uint32(40).uint32(message.feeUpdateDelay);
    }
    if (message.pubKey !== "") {
      writer.uint32(50).string(message.pubKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgEditDataProxy {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgEditDataProxy();
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

          message.newPayoutAddress = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.newMemo = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.newFee = Coin.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.feeUpdateDelay = reader.uint32();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.pubKey = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgEditDataProxy {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      newPayoutAddress: isSet(object.newPayoutAddress) ? globalThis.String(object.newPayoutAddress) : "",
      newMemo: isSet(object.newMemo) ? globalThis.String(object.newMemo) : "",
      newFee: isSet(object.newFee) ? Coin.fromJSON(object.newFee) : undefined,
      feeUpdateDelay: isSet(object.feeUpdateDelay) ? globalThis.Number(object.feeUpdateDelay) : 0,
      pubKey: isSet(object.pubKey) ? globalThis.String(object.pubKey) : "",
    };
  },

  toJSON(message: MsgEditDataProxy): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.newPayoutAddress !== "") {
      obj.newPayoutAddress = message.newPayoutAddress;
    }
    if (message.newMemo !== "") {
      obj.newMemo = message.newMemo;
    }
    if (message.newFee !== undefined) {
      obj.newFee = Coin.toJSON(message.newFee);
    }
    if (message.feeUpdateDelay !== 0) {
      obj.feeUpdateDelay = Math.round(message.feeUpdateDelay);
    }
    if (message.pubKey !== "") {
      obj.pubKey = message.pubKey;
    }
    return obj;
  },

  create(base?: DeepPartial<MsgEditDataProxy>): MsgEditDataProxy {
    return MsgEditDataProxy.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgEditDataProxy>): MsgEditDataProxy {
    const message = createBaseMsgEditDataProxy();
    message.sender = object.sender ?? "";
    message.newPayoutAddress = object.newPayoutAddress ?? "";
    message.newMemo = object.newMemo ?? "";
    message.newFee = (object.newFee !== undefined && object.newFee !== null)
      ? Coin.fromPartial(object.newFee)
      : undefined;
    message.feeUpdateDelay = object.feeUpdateDelay ?? 0;
    message.pubKey = object.pubKey ?? "";
    return message;
  },
};

function createBaseMsgTransferAdmin(): MsgTransferAdmin {
  return { sender: "", newAdminAddress: "", pubKey: "" };
}

export const MsgTransferAdmin = {
  encode(message: MsgTransferAdmin, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.newAdminAddress !== "") {
      writer.uint32(18).string(message.newAdminAddress);
    }
    if (message.pubKey !== "") {
      writer.uint32(26).string(message.pubKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgTransferAdmin {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgTransferAdmin();
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

          message.newAdminAddress = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.pubKey = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgTransferAdmin {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      newAdminAddress: isSet(object.newAdminAddress) ? globalThis.String(object.newAdminAddress) : "",
      pubKey: isSet(object.pubKey) ? globalThis.String(object.pubKey) : "",
    };
  },

  toJSON(message: MsgTransferAdmin): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.newAdminAddress !== "") {
      obj.newAdminAddress = message.newAdminAddress;
    }
    if (message.pubKey !== "") {
      obj.pubKey = message.pubKey;
    }
    return obj;
  },

  create(base?: DeepPartial<MsgTransferAdmin>): MsgTransferAdmin {
    return MsgTransferAdmin.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgTransferAdmin>): MsgTransferAdmin {
    const message = createBaseMsgTransferAdmin();
    message.sender = object.sender ?? "";
    message.newAdminAddress = object.newAdminAddress ?? "";
    message.pubKey = object.pubKey ?? "";
    return message;
  },
};

function createBaseMsgTransferAdminResponse(): MsgTransferAdminResponse {
  return {};
}

export const MsgTransferAdminResponse = {
  encode(_: MsgTransferAdminResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgTransferAdminResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgTransferAdminResponse();
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

  fromJSON(_: any): MsgTransferAdminResponse {
    return {};
  },

  toJSON(_: MsgTransferAdminResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<MsgTransferAdminResponse>): MsgTransferAdminResponse {
    return MsgTransferAdminResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<MsgTransferAdminResponse>): MsgTransferAdminResponse {
    const message = createBaseMsgTransferAdminResponse();
    return message;
  },
};

function createBaseMsgEditDataProxyResponse(): MsgEditDataProxyResponse {
  return { feeUpdateHeight: 0n };
}

export const MsgEditDataProxyResponse = {
  encode(message: MsgEditDataProxyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.feeUpdateHeight !== 0n) {
      if (BigInt.asIntN(64, message.feeUpdateHeight) !== message.feeUpdateHeight) {
        throw new globalThis.Error("value provided for field message.feeUpdateHeight of type int64 too large");
      }
      writer.uint32(8).int64(message.feeUpdateHeight.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgEditDataProxyResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgEditDataProxyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.feeUpdateHeight = longToBigint(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgEditDataProxyResponse {
    return { feeUpdateHeight: isSet(object.feeUpdateHeight) ? BigInt(object.feeUpdateHeight) : 0n };
  },

  toJSON(message: MsgEditDataProxyResponse): unknown {
    const obj: any = {};
    if (message.feeUpdateHeight !== 0n) {
      obj.feeUpdateHeight = message.feeUpdateHeight.toString();
    }
    return obj;
  },

  create(base?: DeepPartial<MsgEditDataProxyResponse>): MsgEditDataProxyResponse {
    return MsgEditDataProxyResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgEditDataProxyResponse>): MsgEditDataProxyResponse {
    const message = createBaseMsgEditDataProxyResponse();
    message.feeUpdateHeight = object.feeUpdateHeight ?? 0n;
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

/** Msg service defines the data-proxy tx gRPC methods. */
export interface Msg {
  /** Registers a new data proxy entry in the registry. */
  RegisterDataProxy(request: MsgRegisterDataProxy): Promise<MsgRegisterDataProxyResponse>;
  /** Edits an existing data proxy. */
  EditDataProxy(request: MsgEditDataProxy): Promise<MsgEditDataProxyResponse>;
  /** Transfers the admin address of a data proxy */
  TransferAdmin(request: MsgTransferAdmin): Promise<MsgTransferAdminResponse>;
  /** Used to update the modules parameters through governance. */
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
}

export const MsgServiceName = "sedachain.data_proxy.v1.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.RegisterDataProxy = this.RegisterDataProxy.bind(this);
    this.EditDataProxy = this.EditDataProxy.bind(this);
    this.TransferAdmin = this.TransferAdmin.bind(this);
    this.UpdateParams = this.UpdateParams.bind(this);
  }
  RegisterDataProxy(request: MsgRegisterDataProxy): Promise<MsgRegisterDataProxyResponse> {
    const data = MsgRegisterDataProxy.encode(request).finish();
    const promise = this.rpc.request(this.service, "RegisterDataProxy", data);
    return promise.then((data) => MsgRegisterDataProxyResponse.decode(_m0.Reader.create(data)));
  }

  EditDataProxy(request: MsgEditDataProxy): Promise<MsgEditDataProxyResponse> {
    const data = MsgEditDataProxy.encode(request).finish();
    const promise = this.rpc.request(this.service, "EditDataProxy", data);
    return promise.then((data) => MsgEditDataProxyResponse.decode(_m0.Reader.create(data)));
  }

  TransferAdmin(request: MsgTransferAdmin): Promise<MsgTransferAdminResponse> {
    const data = MsgTransferAdmin.encode(request).finish();
    const promise = this.rpc.request(this.service, "TransferAdmin", data);
    return promise.then((data) => MsgTransferAdminResponse.decode(_m0.Reader.create(data)));
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

type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToBigint(long: Long) {
  return BigInt(long.toString());
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
