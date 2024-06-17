import _m0 from "protobufjs/minimal.js";
import { Wasm } from "./wasm_storage.js";
/** The request message for QueryDataRequestWasm RPC. */
export interface QueryDataRequestWasmRequest {
    hash: string;
}
/** The response message for QueryDataRequestWasm RPC. */
export interface QueryDataRequestWasmResponse {
    wasm: Wasm | undefined;
}
/** The request message for QueryDataRequestWasms RPC. */
export interface QueryDataRequestWasmsRequest {
}
/** The response message for QueryDataRequestWasms RPC. */
export interface QueryDataRequestWasmsResponse {
    hashTypePairs: string[];
}
/** The request message for QueryOverlayWasm RPC. */
export interface QueryOverlayWasmRequest {
    hash: string;
}
/** The response message for QueryOverlayWasm RPC. */
export interface QueryOverlayWasmResponse {
    wasm: Wasm | undefined;
}
/** The request message for QueryOverlayWasms RPC. */
export interface QueryOverlayWasmsRequest {
}
/** The response message for QueryOverlayWasms RPC. */
export interface QueryOverlayWasmsResponse {
    hashTypePairs: string[];
}
/** The request message for QueryProxyContractRegistry RPC. */
export interface QueryProxyContractRegistryRequest {
}
/** The response message for QueryProxyContractRegistry RPC. */
export interface QueryProxyContractRegistryResponse {
    address: string;
}
export declare const QueryDataRequestWasmRequest: {
    encode(message: QueryDataRequestWasmRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataRequestWasmRequest;
    fromJSON(object: any): QueryDataRequestWasmRequest;
    toJSON(message: QueryDataRequestWasmRequest): unknown;
    create(base?: DeepPartial<QueryDataRequestWasmRequest>): QueryDataRequestWasmRequest;
    fromPartial(object: DeepPartial<QueryDataRequestWasmRequest>): QueryDataRequestWasmRequest;
};
export declare const QueryDataRequestWasmResponse: {
    encode(message: QueryDataRequestWasmResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataRequestWasmResponse;
    fromJSON(object: any): QueryDataRequestWasmResponse;
    toJSON(message: QueryDataRequestWasmResponse): unknown;
    create(base?: DeepPartial<QueryDataRequestWasmResponse>): QueryDataRequestWasmResponse;
    fromPartial(object: DeepPartial<QueryDataRequestWasmResponse>): QueryDataRequestWasmResponse;
};
export declare const QueryDataRequestWasmsRequest: {
    encode(_: QueryDataRequestWasmsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataRequestWasmsRequest;
    fromJSON(_: any): QueryDataRequestWasmsRequest;
    toJSON(_: QueryDataRequestWasmsRequest): unknown;
    create(base?: DeepPartial<QueryDataRequestWasmsRequest>): QueryDataRequestWasmsRequest;
    fromPartial(_: DeepPartial<QueryDataRequestWasmsRequest>): QueryDataRequestWasmsRequest;
};
export declare const QueryDataRequestWasmsResponse: {
    encode(message: QueryDataRequestWasmsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataRequestWasmsResponse;
    fromJSON(object: any): QueryDataRequestWasmsResponse;
    toJSON(message: QueryDataRequestWasmsResponse): unknown;
    create(base?: DeepPartial<QueryDataRequestWasmsResponse>): QueryDataRequestWasmsResponse;
    fromPartial(object: DeepPartial<QueryDataRequestWasmsResponse>): QueryDataRequestWasmsResponse;
};
export declare const QueryOverlayWasmRequest: {
    encode(message: QueryOverlayWasmRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryOverlayWasmRequest;
    fromJSON(object: any): QueryOverlayWasmRequest;
    toJSON(message: QueryOverlayWasmRequest): unknown;
    create(base?: DeepPartial<QueryOverlayWasmRequest>): QueryOverlayWasmRequest;
    fromPartial(object: DeepPartial<QueryOverlayWasmRequest>): QueryOverlayWasmRequest;
};
export declare const QueryOverlayWasmResponse: {
    encode(message: QueryOverlayWasmResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryOverlayWasmResponse;
    fromJSON(object: any): QueryOverlayWasmResponse;
    toJSON(message: QueryOverlayWasmResponse): unknown;
    create(base?: DeepPartial<QueryOverlayWasmResponse>): QueryOverlayWasmResponse;
    fromPartial(object: DeepPartial<QueryOverlayWasmResponse>): QueryOverlayWasmResponse;
};
export declare const QueryOverlayWasmsRequest: {
    encode(_: QueryOverlayWasmsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryOverlayWasmsRequest;
    fromJSON(_: any): QueryOverlayWasmsRequest;
    toJSON(_: QueryOverlayWasmsRequest): unknown;
    create(base?: DeepPartial<QueryOverlayWasmsRequest>): QueryOverlayWasmsRequest;
    fromPartial(_: DeepPartial<QueryOverlayWasmsRequest>): QueryOverlayWasmsRequest;
};
export declare const QueryOverlayWasmsResponse: {
    encode(message: QueryOverlayWasmsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryOverlayWasmsResponse;
    fromJSON(object: any): QueryOverlayWasmsResponse;
    toJSON(message: QueryOverlayWasmsResponse): unknown;
    create(base?: DeepPartial<QueryOverlayWasmsResponse>): QueryOverlayWasmsResponse;
    fromPartial(object: DeepPartial<QueryOverlayWasmsResponse>): QueryOverlayWasmsResponse;
};
export declare const QueryProxyContractRegistryRequest: {
    encode(_: QueryProxyContractRegistryRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryProxyContractRegistryRequest;
    fromJSON(_: any): QueryProxyContractRegistryRequest;
    toJSON(_: QueryProxyContractRegistryRequest): unknown;
    create(base?: DeepPartial<QueryProxyContractRegistryRequest>): QueryProxyContractRegistryRequest;
    fromPartial(_: DeepPartial<QueryProxyContractRegistryRequest>): QueryProxyContractRegistryRequest;
};
export declare const QueryProxyContractRegistryResponse: {
    encode(message: QueryProxyContractRegistryResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryProxyContractRegistryResponse;
    fromJSON(object: any): QueryProxyContractRegistryResponse;
    toJSON(message: QueryProxyContractRegistryResponse): unknown;
    create(base?: DeepPartial<QueryProxyContractRegistryResponse>): QueryProxyContractRegistryResponse;
    fromPartial(object: DeepPartial<QueryProxyContractRegistryResponse>): QueryProxyContractRegistryResponse;
};
/** Query defines the gRPC querier service. */
export interface Query {
    /** DataRequestWasm returns Data Request Wasm given its hash. */
    DataRequestWasm(request: QueryDataRequestWasmRequest): Promise<QueryDataRequestWasmResponse>;
    /** DataRequestWasms returns all Data Request Wasms. */
    DataRequestWasms(request: QueryDataRequestWasmsRequest): Promise<QueryDataRequestWasmsResponse>;
    /** OverlayWasm returns Overlay Wasm given its hash. */
    OverlayWasm(request: QueryOverlayWasmRequest): Promise<QueryOverlayWasmResponse>;
    /** OverlayWasms returns all Overlay Wasms. */
    OverlayWasms(request: QueryOverlayWasmsRequest): Promise<QueryOverlayWasmsResponse>;
    /** ProxyContractRegistry returns the Proxy Contract Registry address. */
    ProxyContractRegistry(request: QueryProxyContractRegistryRequest): Promise<QueryProxyContractRegistryResponse>;
}
export declare const QueryServiceName = "sedachain.wasm_storage.v1.Query";
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    private readonly service;
    constructor(rpc: Rpc, opts?: {
        service?: string;
    });
    DataRequestWasm(request: QueryDataRequestWasmRequest): Promise<QueryDataRequestWasmResponse>;
    DataRequestWasms(request: QueryDataRequestWasmsRequest): Promise<QueryDataRequestWasmsResponse>;
    OverlayWasm(request: QueryOverlayWasmRequest): Promise<QueryOverlayWasmResponse>;
    OverlayWasms(request: QueryOverlayWasmsRequest): Promise<QueryOverlayWasmsResponse>;
    ProxyContractRegistry(request: QueryProxyContractRegistryRequest): Promise<QueryProxyContractRegistryResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
