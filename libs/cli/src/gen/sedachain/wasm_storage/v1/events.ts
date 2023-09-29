/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { WasmType, wasmTypeFromJSON, wasmTypeToJSON } from "./wasm_storage.js";

export const protobufPackage = "sedachain.wasm_storage.v1";

export interface EventStoreDataRequestWasm {
  hash: string;
  wasmType: WasmType;
  bytecode: Uint8Array;
}

export interface EventStoreOverlayWasm {
  hash: string;
  wasmType: WasmType;
  bytecode: Uint8Array;
}

function createBaseEventStoreDataRequestWasm(): EventStoreDataRequestWasm {
  return { hash: "", wasmType: 0, bytecode: new Uint8Array(0) };
}

export const EventStoreDataRequestWasm = {
  encode(message: EventStoreDataRequestWasm, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    if (message.wasmType !== 0) {
      writer.uint32(16).int32(message.wasmType);
    }
    if (message.bytecode.length !== 0) {
      writer.uint32(26).bytes(message.bytecode);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventStoreDataRequestWasm {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventStoreDataRequestWasm();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.hash = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.wasmType = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.bytecode = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventStoreDataRequestWasm {
    return {
      hash: isSet(object.hash) ? String(object.hash) : "",
      wasmType: isSet(object.wasmType) ? wasmTypeFromJSON(object.wasmType) : 0,
      bytecode: isSet(object.bytecode) ? bytesFromBase64(object.bytecode) : new Uint8Array(0),
    };
  },

  toJSON(message: EventStoreDataRequestWasm): unknown {
    const obj: any = {};
    if (message.hash !== "") {
      obj.hash = message.hash;
    }
    if (message.wasmType !== 0) {
      obj.wasmType = wasmTypeToJSON(message.wasmType);
    }
    if (message.bytecode.length !== 0) {
      obj.bytecode = base64FromBytes(message.bytecode);
    }
    return obj;
  },

  create(base?: DeepPartial<EventStoreDataRequestWasm>): EventStoreDataRequestWasm {
    return EventStoreDataRequestWasm.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<EventStoreDataRequestWasm>): EventStoreDataRequestWasm {
    const message = createBaseEventStoreDataRequestWasm();
    message.hash = object.hash ?? "";
    message.wasmType = object.wasmType ?? 0;
    message.bytecode = object.bytecode ?? new Uint8Array(0);
    return message;
  },
};

function createBaseEventStoreOverlayWasm(): EventStoreOverlayWasm {
  return { hash: "", wasmType: 0, bytecode: new Uint8Array(0) };
}

export const EventStoreOverlayWasm = {
  encode(message: EventStoreOverlayWasm, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    if (message.wasmType !== 0) {
      writer.uint32(16).int32(message.wasmType);
    }
    if (message.bytecode.length !== 0) {
      writer.uint32(26).bytes(message.bytecode);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventStoreOverlayWasm {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventStoreOverlayWasm();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.hash = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.wasmType = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.bytecode = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventStoreOverlayWasm {
    return {
      hash: isSet(object.hash) ? String(object.hash) : "",
      wasmType: isSet(object.wasmType) ? wasmTypeFromJSON(object.wasmType) : 0,
      bytecode: isSet(object.bytecode) ? bytesFromBase64(object.bytecode) : new Uint8Array(0),
    };
  },

  toJSON(message: EventStoreOverlayWasm): unknown {
    const obj: any = {};
    if (message.hash !== "") {
      obj.hash = message.hash;
    }
    if (message.wasmType !== 0) {
      obj.wasmType = wasmTypeToJSON(message.wasmType);
    }
    if (message.bytecode.length !== 0) {
      obj.bytecode = base64FromBytes(message.bytecode);
    }
    return obj;
  },

  create(base?: DeepPartial<EventStoreOverlayWasm>): EventStoreOverlayWasm {
    return EventStoreOverlayWasm.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<EventStoreOverlayWasm>): EventStoreOverlayWasm {
    const message = createBaseEventStoreOverlayWasm();
    message.hash = object.hash ?? "";
    message.wasmType = object.wasmType ?? 0;
    message.bytecode = object.bytecode ?? new Uint8Array(0);
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
