/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { Timestamp } from "../../../google/protobuf/timestamp.js";

export const protobufPackage = "sedachain.wasm_storage.v1";

export enum WasmType {
  WASM_TYPE_UNSPECIFIED = 0,
  WASM_TYPE_DATA_REQUEST = 1,
  WASM_TYPE_TALLY = 2,
  WASM_TYPE_DATA_REQUEST_EXECUTOR = 3,
  WASM_TYPE_RELAYER = 4,
  UNRECOGNIZED = -1,
}

export function wasmTypeFromJSON(object: any): WasmType {
  switch (object) {
    case 0:
    case "WASM_TYPE_UNSPECIFIED":
      return WasmType.WASM_TYPE_UNSPECIFIED;
    case 1:
    case "WASM_TYPE_DATA_REQUEST":
      return WasmType.WASM_TYPE_DATA_REQUEST;
    case 2:
    case "WASM_TYPE_TALLY":
      return WasmType.WASM_TYPE_TALLY;
    case 3:
    case "WASM_TYPE_DATA_REQUEST_EXECUTOR":
      return WasmType.WASM_TYPE_DATA_REQUEST_EXECUTOR;
    case 4:
    case "WASM_TYPE_RELAYER":
      return WasmType.WASM_TYPE_RELAYER;
    case -1:
    case "UNRECOGNIZED":
    default:
      return WasmType.UNRECOGNIZED;
  }
}

export function wasmTypeToJSON(object: WasmType): string {
  switch (object) {
    case WasmType.WASM_TYPE_UNSPECIFIED:
      return "WASM_TYPE_UNSPECIFIED";
    case WasmType.WASM_TYPE_DATA_REQUEST:
      return "WASM_TYPE_DATA_REQUEST";
    case WasmType.WASM_TYPE_TALLY:
      return "WASM_TYPE_TALLY";
    case WasmType.WASM_TYPE_DATA_REQUEST_EXECUTOR:
      return "WASM_TYPE_DATA_REQUEST_EXECUTOR";
    case WasmType.WASM_TYPE_RELAYER:
      return "WASM_TYPE_RELAYER";
    case WasmType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Wasm {
  hash: Uint8Array;
  bytecode: Uint8Array;
  wasmType: WasmType;
  addedAt: Date | undefined;
}

export interface Params {
  maxWasmSize: number;
}

function createBaseWasm(): Wasm {
  return { hash: new Uint8Array(0), bytecode: new Uint8Array(0), wasmType: 0, addedAt: undefined };
}

export const Wasm = {
  encode(message: Wasm, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash.length !== 0) {
      writer.uint32(10).bytes(message.hash);
    }
    if (message.bytecode.length !== 0) {
      writer.uint32(18).bytes(message.bytecode);
    }
    if (message.wasmType !== 0) {
      writer.uint32(24).int32(message.wasmType);
    }
    if (message.addedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.addedAt), writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Wasm {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWasm();
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
          if (tag !== 24) {
            break;
          }

          message.wasmType = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
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

  fromJSON(object: any): Wasm {
    return {
      hash: isSet(object.hash) ? bytesFromBase64(object.hash) : new Uint8Array(0),
      bytecode: isSet(object.bytecode) ? bytesFromBase64(object.bytecode) : new Uint8Array(0),
      wasmType: isSet(object.wasmType) ? wasmTypeFromJSON(object.wasmType) : 0,
      addedAt: isSet(object.addedAt) ? fromJsonTimestamp(object.addedAt) : undefined,
    };
  },

  toJSON(message: Wasm): unknown {
    const obj: any = {};
    if (message.hash.length !== 0) {
      obj.hash = base64FromBytes(message.hash);
    }
    if (message.bytecode.length !== 0) {
      obj.bytecode = base64FromBytes(message.bytecode);
    }
    if (message.wasmType !== 0) {
      obj.wasmType = wasmTypeToJSON(message.wasmType);
    }
    if (message.addedAt !== undefined) {
      obj.addedAt = message.addedAt.toISOString();
    }
    return obj;
  },

  create(base?: DeepPartial<Wasm>): Wasm {
    return Wasm.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Wasm>): Wasm {
    const message = createBaseWasm();
    message.hash = object.hash ?? new Uint8Array(0);
    message.bytecode = object.bytecode ?? new Uint8Array(0);
    message.wasmType = object.wasmType ?? 0;
    message.addedAt = object.addedAt ?? undefined;
    return message;
  },
};

function createBaseParams(): Params {
  return { maxWasmSize: 0 };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.maxWasmSize !== 0) {
      writer.uint32(8).uint64(message.maxWasmSize);
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

          message.maxWasmSize = longToNumber(reader.uint64() as Long);
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
    return { maxWasmSize: isSet(object.maxWasmSize) ? Number(object.maxWasmSize) : 0 };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.maxWasmSize !== 0) {
      obj.maxWasmSize = Math.round(message.maxWasmSize);
    }
    return obj;
  },

  create(base?: DeepPartial<Params>): Params {
    return Params.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Params>): Params {
    const message = createBaseParams();
    message.maxWasmSize = object.maxWasmSize ?? 0;
    return message;
  },
};

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

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

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
