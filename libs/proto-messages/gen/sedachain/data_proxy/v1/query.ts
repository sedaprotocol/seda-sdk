// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               unknown
// source: sedachain/data_proxy/v1/query.proto

/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Params, ProxyConfig } from "./data_proxy";

/** The request message for QueryDataProxyConfig RPC method. */
export interface QueryDataProxyConfigRequest {
  /** A hex encoded string of the public key of the data proxy. */
  pubKey: string;
}

/** The response message for QueryDataProxyConfig RPC method. */
export interface QueryDataProxyConfigResponse {
  config: ProxyConfig | undefined;
}

/** QueryParamsRequest is the request type for the Query/Params RPC method. */
export interface QueryParamsRequest {
}

/** QueryParamsResponse is the response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params defines the parameters of the module. */
  params: Params | undefined;
}

function createBaseQueryDataProxyConfigRequest(): QueryDataProxyConfigRequest {
  return { pubKey: "" };
}

export const QueryDataProxyConfigRequest = {
  encode(message: QueryDataProxyConfigRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pubKey !== "") {
      writer.uint32(10).string(message.pubKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataProxyConfigRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryDataProxyConfigRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): QueryDataProxyConfigRequest {
    return { pubKey: isSet(object.pubKey) ? globalThis.String(object.pubKey) : "" };
  },

  toJSON(message: QueryDataProxyConfigRequest): unknown {
    const obj: any = {};
    if (message.pubKey !== "") {
      obj.pubKey = message.pubKey;
    }
    return obj;
  },

  create(base?: DeepPartial<QueryDataProxyConfigRequest>): QueryDataProxyConfigRequest {
    return QueryDataProxyConfigRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<QueryDataProxyConfigRequest>): QueryDataProxyConfigRequest {
    const message = createBaseQueryDataProxyConfigRequest();
    message.pubKey = object.pubKey ?? "";
    return message;
  },
};

function createBaseQueryDataProxyConfigResponse(): QueryDataProxyConfigResponse {
  return { config: undefined };
}

export const QueryDataProxyConfigResponse = {
  encode(message: QueryDataProxyConfigResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.config !== undefined) {
      ProxyConfig.encode(message.config, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataProxyConfigResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryDataProxyConfigResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.config = ProxyConfig.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryDataProxyConfigResponse {
    return { config: isSet(object.config) ? ProxyConfig.fromJSON(object.config) : undefined };
  },

  toJSON(message: QueryDataProxyConfigResponse): unknown {
    const obj: any = {};
    if (message.config !== undefined) {
      obj.config = ProxyConfig.toJSON(message.config);
    }
    return obj;
  },

  create(base?: DeepPartial<QueryDataProxyConfigResponse>): QueryDataProxyConfigResponse {
    return QueryDataProxyConfigResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<QueryDataProxyConfigResponse>): QueryDataProxyConfigResponse {
    const message = createBaseQueryDataProxyConfigResponse();
    message.config = (object.config !== undefined && object.config !== null)
      ? ProxyConfig.fromPartial(object.config)
      : undefined;
    return message;
  },
};

function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}

export const QueryParamsRequest = {
  encode(_: QueryParamsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
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

  fromJSON(_: any): QueryParamsRequest {
    return {};
  },

  toJSON(_: QueryParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<QueryParamsRequest>): QueryParamsRequest {
    return QueryParamsRequest.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<QueryParamsRequest>): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
};

function createBaseQueryParamsResponse(): QueryParamsResponse {
  return { params: undefined };
}

export const QueryParamsResponse = {
  encode(message: QueryParamsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): QueryParamsResponse {
    return { params: isSet(object.params) ? Params.fromJSON(object.params) : undefined };
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    return obj;
  },

  create(base?: DeepPartial<QueryParamsResponse>): QueryParamsResponse {
    return QueryParamsResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<QueryParamsResponse>): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /**
   * DataProxyConfig returns a data proxy config when given its public key as a
   * hex encoded string.
   */
  DataProxyConfig(request: QueryDataProxyConfigRequest): Promise<QueryDataProxyConfigResponse>;
  /** Params returns the total set of data proxy parameters. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
}

export const QueryServiceName = "sedachain.data_proxy.v1.Query";
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || QueryServiceName;
    this.rpc = rpc;
    this.DataProxyConfig = this.DataProxyConfig.bind(this);
    this.Params = this.Params.bind(this);
  }
  DataProxyConfig(request: QueryDataProxyConfigRequest): Promise<QueryDataProxyConfigResponse> {
    const data = QueryDataProxyConfigRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "DataProxyConfig", data);
    return promise.then((data) => QueryDataProxyConfigResponse.decode(_m0.Reader.create(data)));
  }

  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(_m0.Reader.create(data)));
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
