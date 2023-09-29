/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { Wasm } from "./wasm_storage.js";

export const protobufPackage = "sedachain.wasm_storage.v1";

export interface QueryDataRequestWasmRequest {
  hash: string;
}

export interface QueryDataRequestWasmResponse {
  wasm: Wasm | undefined;
}

export interface QueryDataRequestWasmsRequest {
}

export interface QueryDataRequestWasmsResponse {
  hashTypePairs: string[];
}

export interface QueryOverlayWasmRequest {
  hash: string;
}

export interface QueryOverlayWasmResponse {
  wasm: Wasm | undefined;
}

export interface QueryOverlayWasmsRequest {
}

export interface QueryOverlayWasmsResponse {
  hashTypePairs: string[];
}

export interface QueryProxyContractRegistryRequest {
}

export interface QueryProxyContractRegistryResponse {
  address: string;
}

function createBaseQueryDataRequestWasmRequest(): QueryDataRequestWasmRequest {
  return { hash: "" };
}

export const QueryDataRequestWasmRequest = {
  encode(message: QueryDataRequestWasmRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataRequestWasmRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryDataRequestWasmRequest();
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

  fromJSON(object: any): QueryDataRequestWasmRequest {
    return { hash: isSet(object.hash) ? String(object.hash) : "" };
  },

  toJSON(message: QueryDataRequestWasmRequest): unknown {
    const obj: any = {};
    if (message.hash !== "") {
      obj.hash = message.hash;
    }
    return obj;
  },

  create(base?: DeepPartial<QueryDataRequestWasmRequest>): QueryDataRequestWasmRequest {
    return QueryDataRequestWasmRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<QueryDataRequestWasmRequest>): QueryDataRequestWasmRequest {
    const message = createBaseQueryDataRequestWasmRequest();
    message.hash = object.hash ?? "";
    return message;
  },
};

function createBaseQueryDataRequestWasmResponse(): QueryDataRequestWasmResponse {
  return { wasm: undefined };
}

export const QueryDataRequestWasmResponse = {
  encode(message: QueryDataRequestWasmResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.wasm !== undefined) {
      Wasm.encode(message.wasm, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataRequestWasmResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryDataRequestWasmResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.wasm = Wasm.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryDataRequestWasmResponse {
    return { wasm: isSet(object.wasm) ? Wasm.fromJSON(object.wasm) : undefined };
  },

  toJSON(message: QueryDataRequestWasmResponse): unknown {
    const obj: any = {};
    if (message.wasm !== undefined) {
      obj.wasm = Wasm.toJSON(message.wasm);
    }
    return obj;
  },

  create(base?: DeepPartial<QueryDataRequestWasmResponse>): QueryDataRequestWasmResponse {
    return QueryDataRequestWasmResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<QueryDataRequestWasmResponse>): QueryDataRequestWasmResponse {
    const message = createBaseQueryDataRequestWasmResponse();
    message.wasm = (object.wasm !== undefined && object.wasm !== null) ? Wasm.fromPartial(object.wasm) : undefined;
    return message;
  },
};

function createBaseQueryDataRequestWasmsRequest(): QueryDataRequestWasmsRequest {
  return {};
}

export const QueryDataRequestWasmsRequest = {
  encode(_: QueryDataRequestWasmsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataRequestWasmsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryDataRequestWasmsRequest();
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

  fromJSON(_: any): QueryDataRequestWasmsRequest {
    return {};
  },

  toJSON(_: QueryDataRequestWasmsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<QueryDataRequestWasmsRequest>): QueryDataRequestWasmsRequest {
    return QueryDataRequestWasmsRequest.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<QueryDataRequestWasmsRequest>): QueryDataRequestWasmsRequest {
    const message = createBaseQueryDataRequestWasmsRequest();
    return message;
  },
};

function createBaseQueryDataRequestWasmsResponse(): QueryDataRequestWasmsResponse {
  return { hashTypePairs: [] };
}

export const QueryDataRequestWasmsResponse = {
  encode(message: QueryDataRequestWasmsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.hashTypePairs) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataRequestWasmsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryDataRequestWasmsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.hashTypePairs.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryDataRequestWasmsResponse {
    return {
      hashTypePairs: Array.isArray(object?.hashTypePairs) ? object.hashTypePairs.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: QueryDataRequestWasmsResponse): unknown {
    const obj: any = {};
    if (message.hashTypePairs?.length) {
      obj.hashTypePairs = message.hashTypePairs;
    }
    return obj;
  },

  create(base?: DeepPartial<QueryDataRequestWasmsResponse>): QueryDataRequestWasmsResponse {
    return QueryDataRequestWasmsResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<QueryDataRequestWasmsResponse>): QueryDataRequestWasmsResponse {
    const message = createBaseQueryDataRequestWasmsResponse();
    message.hashTypePairs = object.hashTypePairs?.map((e) => e) || [];
    return message;
  },
};

function createBaseQueryOverlayWasmRequest(): QueryOverlayWasmRequest {
  return { hash: "" };
}

export const QueryOverlayWasmRequest = {
  encode(message: QueryOverlayWasmRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryOverlayWasmRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryOverlayWasmRequest();
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

  fromJSON(object: any): QueryOverlayWasmRequest {
    return { hash: isSet(object.hash) ? String(object.hash) : "" };
  },

  toJSON(message: QueryOverlayWasmRequest): unknown {
    const obj: any = {};
    if (message.hash !== "") {
      obj.hash = message.hash;
    }
    return obj;
  },

  create(base?: DeepPartial<QueryOverlayWasmRequest>): QueryOverlayWasmRequest {
    return QueryOverlayWasmRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<QueryOverlayWasmRequest>): QueryOverlayWasmRequest {
    const message = createBaseQueryOverlayWasmRequest();
    message.hash = object.hash ?? "";
    return message;
  },
};

function createBaseQueryOverlayWasmResponse(): QueryOverlayWasmResponse {
  return { wasm: undefined };
}

export const QueryOverlayWasmResponse = {
  encode(message: QueryOverlayWasmResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.wasm !== undefined) {
      Wasm.encode(message.wasm, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryOverlayWasmResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryOverlayWasmResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.wasm = Wasm.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryOverlayWasmResponse {
    return { wasm: isSet(object.wasm) ? Wasm.fromJSON(object.wasm) : undefined };
  },

  toJSON(message: QueryOverlayWasmResponse): unknown {
    const obj: any = {};
    if (message.wasm !== undefined) {
      obj.wasm = Wasm.toJSON(message.wasm);
    }
    return obj;
  },

  create(base?: DeepPartial<QueryOverlayWasmResponse>): QueryOverlayWasmResponse {
    return QueryOverlayWasmResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<QueryOverlayWasmResponse>): QueryOverlayWasmResponse {
    const message = createBaseQueryOverlayWasmResponse();
    message.wasm = (object.wasm !== undefined && object.wasm !== null) ? Wasm.fromPartial(object.wasm) : undefined;
    return message;
  },
};

function createBaseQueryOverlayWasmsRequest(): QueryOverlayWasmsRequest {
  return {};
}

export const QueryOverlayWasmsRequest = {
  encode(_: QueryOverlayWasmsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryOverlayWasmsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryOverlayWasmsRequest();
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

  fromJSON(_: any): QueryOverlayWasmsRequest {
    return {};
  },

  toJSON(_: QueryOverlayWasmsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<QueryOverlayWasmsRequest>): QueryOverlayWasmsRequest {
    return QueryOverlayWasmsRequest.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<QueryOverlayWasmsRequest>): QueryOverlayWasmsRequest {
    const message = createBaseQueryOverlayWasmsRequest();
    return message;
  },
};

function createBaseQueryOverlayWasmsResponse(): QueryOverlayWasmsResponse {
  return { hashTypePairs: [] };
}

export const QueryOverlayWasmsResponse = {
  encode(message: QueryOverlayWasmsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.hashTypePairs) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryOverlayWasmsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryOverlayWasmsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.hashTypePairs.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryOverlayWasmsResponse {
    return {
      hashTypePairs: Array.isArray(object?.hashTypePairs) ? object.hashTypePairs.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: QueryOverlayWasmsResponse): unknown {
    const obj: any = {};
    if (message.hashTypePairs?.length) {
      obj.hashTypePairs = message.hashTypePairs;
    }
    return obj;
  },

  create(base?: DeepPartial<QueryOverlayWasmsResponse>): QueryOverlayWasmsResponse {
    return QueryOverlayWasmsResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<QueryOverlayWasmsResponse>): QueryOverlayWasmsResponse {
    const message = createBaseQueryOverlayWasmsResponse();
    message.hashTypePairs = object.hashTypePairs?.map((e) => e) || [];
    return message;
  },
};

function createBaseQueryProxyContractRegistryRequest(): QueryProxyContractRegistryRequest {
  return {};
}

export const QueryProxyContractRegistryRequest = {
  encode(_: QueryProxyContractRegistryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryProxyContractRegistryRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryProxyContractRegistryRequest();
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

  fromJSON(_: any): QueryProxyContractRegistryRequest {
    return {};
  },

  toJSON(_: QueryProxyContractRegistryRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<QueryProxyContractRegistryRequest>): QueryProxyContractRegistryRequest {
    return QueryProxyContractRegistryRequest.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<QueryProxyContractRegistryRequest>): QueryProxyContractRegistryRequest {
    const message = createBaseQueryProxyContractRegistryRequest();
    return message;
  },
};

function createBaseQueryProxyContractRegistryResponse(): QueryProxyContractRegistryResponse {
  return { address: "" };
}

export const QueryProxyContractRegistryResponse = {
  encode(message: QueryProxyContractRegistryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryProxyContractRegistryResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryProxyContractRegistryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.address = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryProxyContractRegistryResponse {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: QueryProxyContractRegistryResponse): unknown {
    const obj: any = {};
    if (message.address !== "") {
      obj.address = message.address;
    }
    return obj;
  },

  create(base?: DeepPartial<QueryProxyContractRegistryResponse>): QueryProxyContractRegistryResponse {
    return QueryProxyContractRegistryResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<QueryProxyContractRegistryResponse>): QueryProxyContractRegistryResponse {
    const message = createBaseQueryProxyContractRegistryResponse();
    message.address = object.address ?? "";
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** DataRequestWasm returns Data Request Wasm given its hash. */
  DataRequestWasm(request: QueryDataRequestWasmRequest): Promise<QueryDataRequestWasmResponse>;
  DataRequestWasms(request: QueryDataRequestWasmsRequest): Promise<QueryDataRequestWasmsResponse>;
  /** OverlayWasm returns Overlay Wasm given its hash. */
  OverlayWasm(request: QueryOverlayWasmRequest): Promise<QueryOverlayWasmResponse>;
  OverlayWasms(request: QueryOverlayWasmsRequest): Promise<QueryOverlayWasmsResponse>;
  ProxyContractRegistry(request: QueryProxyContractRegistryRequest): Promise<QueryProxyContractRegistryResponse>;
}

export const QueryServiceName = "sedachain.wasm_storage.v1.Query";
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || QueryServiceName;
    this.rpc = rpc;
    this.DataRequestWasm = this.DataRequestWasm.bind(this);
    this.DataRequestWasms = this.DataRequestWasms.bind(this);
    this.OverlayWasm = this.OverlayWasm.bind(this);
    this.OverlayWasms = this.OverlayWasms.bind(this);
    this.ProxyContractRegistry = this.ProxyContractRegistry.bind(this);
  }
  DataRequestWasm(request: QueryDataRequestWasmRequest): Promise<QueryDataRequestWasmResponse> {
    const data = QueryDataRequestWasmRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "DataRequestWasm", data);
    return promise.then((data) => QueryDataRequestWasmResponse.decode(_m0.Reader.create(data)));
  }

  DataRequestWasms(request: QueryDataRequestWasmsRequest): Promise<QueryDataRequestWasmsResponse> {
    const data = QueryDataRequestWasmsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "DataRequestWasms", data);
    return promise.then((data) => QueryDataRequestWasmsResponse.decode(_m0.Reader.create(data)));
  }

  OverlayWasm(request: QueryOverlayWasmRequest): Promise<QueryOverlayWasmResponse> {
    const data = QueryOverlayWasmRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "OverlayWasm", data);
    return promise.then((data) => QueryOverlayWasmResponse.decode(_m0.Reader.create(data)));
  }

  OverlayWasms(request: QueryOverlayWasmsRequest): Promise<QueryOverlayWasmsResponse> {
    const data = QueryOverlayWasmsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "OverlayWasms", data);
    return promise.then((data) => QueryOverlayWasmsResponse.decode(_m0.Reader.create(data)));
  }

  ProxyContractRegistry(request: QueryProxyContractRegistryRequest): Promise<QueryProxyContractRegistryResponse> {
    const data = QueryProxyContractRegistryRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ProxyContractRegistry", data);
    return promise.then((data) => QueryProxyContractRegistryResponse.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
