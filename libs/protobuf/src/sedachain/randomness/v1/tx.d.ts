import _m0 from "protobufjs/minimal.js";
/** The message for submitting a new seed to the chain. */
export interface MsgNewSeed {
  /** address of VRF key used to produce proof */
  prover: string;
  /** VRF proof */
  pi: string;
  /** VRF hash */
  beta: string;
}
/** The response message for submitting a new seed to the chain. */
export interface MsgNewSeedResponse {}
export declare const MsgNewSeed: {
  encode(message: MsgNewSeed, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgNewSeed;
  fromJSON(object: any): MsgNewSeed;
  toJSON(message: MsgNewSeed): unknown;
  create(base?: DeepPartial<MsgNewSeed>): MsgNewSeed;
  fromPartial(object: DeepPartial<MsgNewSeed>): MsgNewSeed;
};
export declare const MsgNewSeedResponse: {
  encode(_: MsgNewSeedResponse, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgNewSeedResponse;
  fromJSON(_: any): MsgNewSeedResponse;
  toJSON(_: MsgNewSeedResponse): unknown;
  create(base?: DeepPartial<MsgNewSeedResponse>): MsgNewSeedResponse;
  fromPartial(_: DeepPartial<MsgNewSeedResponse>): MsgNewSeedResponse;
};
/** Msg service defines the gRPC tx methods. */
export interface Msg {
  /** NewSeed defines a method for submitting a new seed to the chain. */
  NewSeed(request: MsgNewSeed): Promise<MsgNewSeedResponse>;
}
export declare const MsgServiceName = "sedachain.randomness.v1.Msg";
export declare class MsgClientImpl implements Msg {
  private readonly rpc;
  private readonly service;
  constructor(
    rpc: Rpc,
    opts?: {
      service?: string;
    }
  );
  NewSeed(request: MsgNewSeed): Promise<MsgNewSeedResponse>;
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
