import _m0 from "protobufjs/minimal.js";
/** The message for getting the random modules seed. */
export interface QuerySeedRequest {}
/** The message for returning the random modules seed. */
export interface QuerySeedResponse {
  seed: string;
  blockHeight: number;
}
export declare const QuerySeedRequest: {
  encode(_: QuerySeedRequest, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): QuerySeedRequest;
  fromJSON(_: any): QuerySeedRequest;
  toJSON(_: QuerySeedRequest): unknown;
  create(base?: DeepPartial<QuerySeedRequest>): QuerySeedRequest;
  fromPartial(_: DeepPartial<QuerySeedRequest>): QuerySeedRequest;
};
export declare const QuerySeedResponse: {
  encode(message: QuerySeedResponse, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): QuerySeedResponse;
  fromJSON(object: any): QuerySeedResponse;
  toJSON(message: QuerySeedResponse): unknown;
  create(base?: DeepPartial<QuerySeedResponse>): QuerySeedResponse;
  fromPartial(object: DeepPartial<QuerySeedResponse>): QuerySeedResponse;
};
/** Query Service is the definition for the random modules gRPC query methods. */
export interface Query {
  /** For getting the random modules seed. */
  Seed(request: QuerySeedRequest): Promise<QuerySeedResponse>;
}
export declare const QueryServiceName = "sedachain.randomness.v1.Query";
export declare class QueryClientImpl implements Query {
  private readonly rpc;
  private readonly service;
  constructor(
    rpc: Rpc,
    opts?: {
      service?: string;
    }
  );
  Seed(request: QuerySeedRequest): Promise<QuerySeedResponse>;
}
interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}
type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;
type DeepPartial<T> = T extends Builtin
  ? T
  : T extends globalThis.Array<infer U>
  ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? {
      [K in keyof T]?: DeepPartial<T[K]>;
    }
  : Partial<T>;
export {};
