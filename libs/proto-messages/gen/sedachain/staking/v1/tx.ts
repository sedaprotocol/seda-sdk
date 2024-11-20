// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               unknown
// source: sedachain/staking/v1/tx.proto

/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { CommissionRates, Description } from "../../../cosmos/staking/v1beta1/staking";
import { Any } from "../../../google/protobuf/any";

/** MsgCreateValidator defines a SDK message for creating a new validator. */
export interface MsgCreateValidatorWithVRF {
  description: Description | undefined;
  commission: CommissionRates | undefined;
  minSelfDelegation: string;
  /**
   * Deprecated: Use of Delegator Address in MsgCreateValidator is deprecated.
   * The validator address bytes and delegator address bytes refer to the same
   * account while creating validator (defer only in bech32 notation).
   *
   * @deprecated
   */
  delegatorAddress: string;
  validatorAddress: string;
  pubkey: Any | undefined;
  value: Coin | undefined;
  vrfPubkey: Any | undefined;
}

/** MsgCreateValidatorResponse defines the Msg/CreateValidator response type. */
export interface MsgCreateValidatorWithVRFResponse {
}

function createBaseMsgCreateValidatorWithVRF(): MsgCreateValidatorWithVRF {
  return {
    description: undefined,
    commission: undefined,
    minSelfDelegation: "",
    delegatorAddress: "",
    validatorAddress: "",
    pubkey: undefined,
    value: undefined,
    vrfPubkey: undefined,
  };
}

export const MsgCreateValidatorWithVRF = {
  encode(message: MsgCreateValidatorWithVRF, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.description !== undefined) {
      Description.encode(message.description, writer.uint32(10).fork()).ldelim();
    }
    if (message.commission !== undefined) {
      CommissionRates.encode(message.commission, writer.uint32(18).fork()).ldelim();
    }
    if (message.minSelfDelegation !== "") {
      writer.uint32(26).string(message.minSelfDelegation);
    }
    if (message.delegatorAddress !== "") {
      writer.uint32(34).string(message.delegatorAddress);
    }
    if (message.validatorAddress !== "") {
      writer.uint32(42).string(message.validatorAddress);
    }
    if (message.pubkey !== undefined) {
      Any.encode(message.pubkey, writer.uint32(50).fork()).ldelim();
    }
    if (message.value !== undefined) {
      Coin.encode(message.value, writer.uint32(58).fork()).ldelim();
    }
    if (message.vrfPubkey !== undefined) {
      Any.encode(message.vrfPubkey, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateValidatorWithVRF {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateValidatorWithVRF();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.description = Description.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.commission = CommissionRates.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.minSelfDelegation = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.delegatorAddress = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.validatorAddress = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.pubkey = Any.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.value = Coin.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.vrfPubkey = Any.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgCreateValidatorWithVRF {
    return {
      description: isSet(object.description) ? Description.fromJSON(object.description) : undefined,
      commission: isSet(object.commission) ? CommissionRates.fromJSON(object.commission) : undefined,
      minSelfDelegation: isSet(object.minSelfDelegation) ? globalThis.String(object.minSelfDelegation) : "",
      delegatorAddress: isSet(object.delegatorAddress) ? globalThis.String(object.delegatorAddress) : "",
      validatorAddress: isSet(object.validatorAddress) ? globalThis.String(object.validatorAddress) : "",
      pubkey: isSet(object.pubkey) ? Any.fromJSON(object.pubkey) : undefined,
      value: isSet(object.value) ? Coin.fromJSON(object.value) : undefined,
      vrfPubkey: isSet(object.vrfPubkey) ? Any.fromJSON(object.vrfPubkey) : undefined,
    };
  },

  toJSON(message: MsgCreateValidatorWithVRF): unknown {
    const obj: any = {};
    if (message.description !== undefined) {
      obj.description = Description.toJSON(message.description);
    }
    if (message.commission !== undefined) {
      obj.commission = CommissionRates.toJSON(message.commission);
    }
    if (message.minSelfDelegation !== "") {
      obj.minSelfDelegation = message.minSelfDelegation;
    }
    if (message.delegatorAddress !== "") {
      obj.delegatorAddress = message.delegatorAddress;
    }
    if (message.validatorAddress !== "") {
      obj.validatorAddress = message.validatorAddress;
    }
    if (message.pubkey !== undefined) {
      obj.pubkey = Any.toJSON(message.pubkey);
    }
    if (message.value !== undefined) {
      obj.value = Coin.toJSON(message.value);
    }
    if (message.vrfPubkey !== undefined) {
      obj.vrfPubkey = Any.toJSON(message.vrfPubkey);
    }
    return obj;
  },

  create(base?: DeepPartial<MsgCreateValidatorWithVRF>): MsgCreateValidatorWithVRF {
    return MsgCreateValidatorWithVRF.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<MsgCreateValidatorWithVRF>): MsgCreateValidatorWithVRF {
    const message = createBaseMsgCreateValidatorWithVRF();
    message.description = (object.description !== undefined && object.description !== null)
      ? Description.fromPartial(object.description)
      : undefined;
    message.commission = (object.commission !== undefined && object.commission !== null)
      ? CommissionRates.fromPartial(object.commission)
      : undefined;
    message.minSelfDelegation = object.minSelfDelegation ?? "";
    message.delegatorAddress = object.delegatorAddress ?? "";
    message.validatorAddress = object.validatorAddress ?? "";
    message.pubkey = (object.pubkey !== undefined && object.pubkey !== null)
      ? Any.fromPartial(object.pubkey)
      : undefined;
    message.value = (object.value !== undefined && object.value !== null) ? Coin.fromPartial(object.value) : undefined;
    message.vrfPubkey = (object.vrfPubkey !== undefined && object.vrfPubkey !== null)
      ? Any.fromPartial(object.vrfPubkey)
      : undefined;
    return message;
  },
};

function createBaseMsgCreateValidatorWithVRFResponse(): MsgCreateValidatorWithVRFResponse {
  return {};
}

export const MsgCreateValidatorWithVRFResponse = {
  encode(_: MsgCreateValidatorWithVRFResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateValidatorWithVRFResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateValidatorWithVRFResponse();
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

  fromJSON(_: any): MsgCreateValidatorWithVRFResponse {
    return {};
  },

  toJSON(_: MsgCreateValidatorWithVRFResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<MsgCreateValidatorWithVRFResponse>): MsgCreateValidatorWithVRFResponse {
    return MsgCreateValidatorWithVRFResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<MsgCreateValidatorWithVRFResponse>): MsgCreateValidatorWithVRFResponse {
    const message = createBaseMsgCreateValidatorWithVRFResponse();
    return message;
  },
};

/** Msg defines the staking Msg service. */
export interface Msg {
  /** CreateValidatorWithVRF defines a method for creating a new validator. */
  CreateValidatorWithVRF(request: MsgCreateValidatorWithVRF): Promise<MsgCreateValidatorWithVRFResponse>;
}

export const MsgServiceName = "sedachain.staking.v1.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.CreateValidatorWithVRF = this.CreateValidatorWithVRF.bind(this);
  }
  CreateValidatorWithVRF(request: MsgCreateValidatorWithVRF): Promise<MsgCreateValidatorWithVRFResponse> {
    const data = MsgCreateValidatorWithVRF.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateValidatorWithVRF", data);
    return promise.then((data) => MsgCreateValidatorWithVRFResponse.decode(_m0.Reader.create(data)));
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
