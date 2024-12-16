// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               unknown
// source: sedachain/tally/v1/tally.proto

/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

/** Params defines the parameters for the tally module. */
export interface Params {
  /** max_tally_gas_limit is the maximum gas limit for a tally request. */
  maxTallyGasLimit: bigint;
}

function createBaseParams(): Params {
  return { maxTallyGasLimit: 0n };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.maxTallyGasLimit !== 0n) {
      if (BigInt.asUintN(64, message.maxTallyGasLimit) !== message.maxTallyGasLimit) {
        throw new globalThis.Error("value provided for field message.maxTallyGasLimit of type uint64 too large");
      }
      writer.uint32(8).uint64(message.maxTallyGasLimit.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.maxTallyGasLimit = longToBigint(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Params {
    return { maxTallyGasLimit: isSet(object.maxTallyGasLimit) ? BigInt(object.maxTallyGasLimit) : 0n };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.maxTallyGasLimit !== 0n) {
      obj.maxTallyGasLimit = message.maxTallyGasLimit.toString();
    }
    return obj;
  },

  create(base?: DeepPartial<Params>): Params {
    return Params.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Params>): Params {
    const message = createBaseParams();
    message.maxTallyGasLimit = object.maxTallyGasLimit ?? 0n;
    return message;
  },
};

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
