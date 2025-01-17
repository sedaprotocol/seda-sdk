// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               unknown
// source: sedachain/wasm_storage/v1/wasm_storage.proto

/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Timestamp } from "../../../google/protobuf/timestamp";

/** OracleProgram is a wasm used for data request. */
export interface OracleProgram {
  hash: Uint8Array;
  bytecode: Uint8Array;
  addedAt:
    | Date
    | undefined;
  /**
   * ExpirationHeight represents the block height at which the oracle
   * program will be pruned. The value of zero means no expiration.
   */
  expirationHeight: bigint;
}

/** ExecutorWasm is a wasm used by some component in the protocol. */
export interface ExecutorWasm {
  hash: Uint8Array;
  bytecode: Uint8Array;
  addedAt: Date | undefined;
}

/** Params to define the max wasm size allowed. */
export interface Params {
  maxWasmSize: bigint;
  /**
   * WasmTTL represents the number of blocks a wasm's life is extended when it's
   * created or used.
   */
  wasmTtl: bigint;
}

function createBaseOracleProgram(): OracleProgram {
  return { hash: new Uint8Array(0), bytecode: new Uint8Array(0), addedAt: undefined, expirationHeight: 0n };
}

export const OracleProgram = {
  encode(message: OracleProgram, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash.length !== 0) {
      writer.uint32(10).bytes(message.hash);
    }
    if (message.bytecode.length !== 0) {
      writer.uint32(18).bytes(message.bytecode);
    }
    if (message.addedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.addedAt), writer.uint32(26).fork()).ldelim();
    }
    if (message.expirationHeight !== 0n) {
      if (BigInt.asIntN(64, message.expirationHeight) !== message.expirationHeight) {
        throw new globalThis.Error("value provided for field message.expirationHeight of type int64 too large");
      }
      writer.uint32(32).int64(message.expirationHeight.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OracleProgram {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOracleProgram();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.hash = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.bytecode = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.addedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.expirationHeight = longToBigint(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OracleProgram {
    return {
      hash: isSet(object.hash) ? bytesFromBase64(object.hash) : new Uint8Array(0),
      bytecode: isSet(object.bytecode) ? bytesFromBase64(object.bytecode) : new Uint8Array(0),
      addedAt: isSet(object.addedAt) ? fromJsonTimestamp(object.addedAt) : undefined,
      expirationHeight: isSet(object.expirationHeight) ? BigInt(object.expirationHeight) : 0n,
    };
  },

  toJSON(message: OracleProgram): unknown {
    const obj: any = {};
    if (message.hash.length !== 0) {
      obj.hash = base64FromBytes(message.hash);
    }
    if (message.bytecode.length !== 0) {
      obj.bytecode = base64FromBytes(message.bytecode);
    }
    if (message.addedAt !== undefined) {
      obj.addedAt = message.addedAt.toISOString();
    }
    if (message.expirationHeight !== 0n) {
      obj.expirationHeight = message.expirationHeight.toString();
    }
    return obj;
  },

  create(base?: DeepPartial<OracleProgram>): OracleProgram {
    return OracleProgram.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<OracleProgram>): OracleProgram {
    const message = createBaseOracleProgram();
    message.hash = object.hash ?? new Uint8Array(0);
    message.bytecode = object.bytecode ?? new Uint8Array(0);
    message.addedAt = object.addedAt ?? undefined;
    message.expirationHeight = object.expirationHeight ?? 0n;
    return message;
  },
};

function createBaseExecutorWasm(): ExecutorWasm {
  return { hash: new Uint8Array(0), bytecode: new Uint8Array(0), addedAt: undefined };
}

export const ExecutorWasm = {
  encode(message: ExecutorWasm, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash.length !== 0) {
      writer.uint32(10).bytes(message.hash);
    }
    if (message.bytecode.length !== 0) {
      writer.uint32(18).bytes(message.bytecode);
    }
    if (message.addedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.addedAt), writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExecutorWasm {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecutorWasm();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.hash = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.bytecode = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.addedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ExecutorWasm {
    return {
      hash: isSet(object.hash) ? bytesFromBase64(object.hash) : new Uint8Array(0),
      bytecode: isSet(object.bytecode) ? bytesFromBase64(object.bytecode) : new Uint8Array(0),
      addedAt: isSet(object.addedAt) ? fromJsonTimestamp(object.addedAt) : undefined,
    };
  },

  toJSON(message: ExecutorWasm): unknown {
    const obj: any = {};
    if (message.hash.length !== 0) {
      obj.hash = base64FromBytes(message.hash);
    }
    if (message.bytecode.length !== 0) {
      obj.bytecode = base64FromBytes(message.bytecode);
    }
    if (message.addedAt !== undefined) {
      obj.addedAt = message.addedAt.toISOString();
    }
    return obj;
  },

  create(base?: DeepPartial<ExecutorWasm>): ExecutorWasm {
    return ExecutorWasm.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ExecutorWasm>): ExecutorWasm {
    const message = createBaseExecutorWasm();
    message.hash = object.hash ?? new Uint8Array(0);
    message.bytecode = object.bytecode ?? new Uint8Array(0);
    message.addedAt = object.addedAt ?? undefined;
    return message;
  },
};

function createBaseParams(): Params {
  return { maxWasmSize: 0n, wasmTtl: 0n };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.maxWasmSize !== 0n) {
      if (BigInt.asIntN(64, message.maxWasmSize) !== message.maxWasmSize) {
        throw new globalThis.Error("value provided for field message.maxWasmSize of type int64 too large");
      }
      writer.uint32(8).int64(message.maxWasmSize.toString());
    }
    if (message.wasmTtl !== 0n) {
      if (BigInt.asIntN(64, message.wasmTtl) !== message.wasmTtl) {
        throw new globalThis.Error("value provided for field message.wasmTtl of type int64 too large");
      }
      writer.uint32(16).int64(message.wasmTtl.toString());
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

          message.maxWasmSize = longToBigint(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.wasmTtl = longToBigint(reader.int64() as Long);
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
    return {
      maxWasmSize: isSet(object.maxWasmSize) ? BigInt(object.maxWasmSize) : 0n,
      wasmTtl: isSet(object.wasmTtl) ? BigInt(object.wasmTtl) : 0n,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.maxWasmSize !== 0n) {
      obj.maxWasmSize = message.maxWasmSize.toString();
    }
    if (message.wasmTtl !== 0n) {
      obj.wasmTtl = message.wasmTtl.toString();
    }
    return obj;
  },

  create(base?: DeepPartial<Params>): Params {
    return Params.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Params>): Params {
    const message = createBaseParams();
    message.maxWasmSize = object.maxWasmSize ?? 0n;
    message.wasmTtl = object.wasmTtl ?? 0n;
    return message;
  },
};

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

type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function toTimestamp(date: Date): Timestamp {
  const seconds = BigInt(Math.trunc(date.getTime() / 1_000));
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (globalThis.Number(t.seconds.toString()) || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof globalThis.Date) {
    return o;
  } else if (typeof o === "string") {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

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
