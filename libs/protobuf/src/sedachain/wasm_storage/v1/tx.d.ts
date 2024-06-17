import _m0 from "protobufjs/minimal.js";
import { Coin } from "../../../cosmos/base/v1beta1/coin.js";
import { Params, WasmType } from "./wasm_storage.js";
/** The request message for the StoreDataRequestWasm method. */
export interface MsgStoreDataRequestWasm {
  sender: string;
  wasm: Uint8Array;
  wasmType: WasmType;
}
/** The response message for the StoreDataRequestWasm method. */
export interface MsgStoreDataRequestWasmResponse {
  hash: string;
}
/** The request message for the StoreOverlayWasm method. */
export interface MsgStoreOverlayWasm {
  sender: string;
  wasm: Uint8Array;
  wasmType: WasmType;
}
/** The response message for the StoreOverlayWasm method. */
export interface MsgStoreOverlayWasmResponse {
  hash: string;
}
/** The request message for the InstantiateAndRegisterProxyContract method. */
export interface MsgInstantiateAndRegisterProxyContract {
  sender: string;
  admin: string;
  codeId: number;
  label: string;
  msg: Uint8Array;
  funds: Coin[];
  salt: Uint8Array;
  fixMsg: boolean;
}
/** The response message for the InstantiateAndRegisterProxyContract method. */
export interface MsgInstantiateAndRegisterProxyContractResponse {
  contractAddress: string;
}
/** The request message for the UpdateParams method. */
export interface MsgUpdateParams {
  /**
   * authority is the address that controls the module (defaults to x/gov unless
   * overwritten).
   */
  authority: string;
  params: Params | undefined;
}
/** no data needs to be returned */
export interface MsgUpdateParamsResponse {}
export declare const MsgStoreDataRequestWasm: {
  encode(message: MsgStoreDataRequestWasm, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgStoreDataRequestWasm;
  fromJSON(object: any): MsgStoreDataRequestWasm;
  toJSON(message: MsgStoreDataRequestWasm): unknown;
  create(base?: DeepPartial<MsgStoreDataRequestWasm>): MsgStoreDataRequestWasm;
  fromPartial(
    object: DeepPartial<MsgStoreDataRequestWasm>
  ): MsgStoreDataRequestWasm;
};
export declare const MsgStoreDataRequestWasmResponse: {
  encode(
    message: MsgStoreDataRequestWasmResponse,
    writer?: _m0.Writer
  ): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgStoreDataRequestWasmResponse;
  fromJSON(object: any): MsgStoreDataRequestWasmResponse;
  toJSON(message: MsgStoreDataRequestWasmResponse): unknown;
  create(
    base?: DeepPartial<MsgStoreDataRequestWasmResponse>
  ): MsgStoreDataRequestWasmResponse;
  fromPartial(
    object: DeepPartial<MsgStoreDataRequestWasmResponse>
  ): MsgStoreDataRequestWasmResponse;
};
export declare const MsgStoreOverlayWasm: {
  encode(message: MsgStoreOverlayWasm, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgStoreOverlayWasm;
  fromJSON(object: any): MsgStoreOverlayWasm;
  toJSON(message: MsgStoreOverlayWasm): unknown;
  create(base?: DeepPartial<MsgStoreOverlayWasm>): MsgStoreOverlayWasm;
  fromPartial(object: DeepPartial<MsgStoreOverlayWasm>): MsgStoreOverlayWasm;
};
export declare const MsgStoreOverlayWasmResponse: {
  encode(message: MsgStoreOverlayWasmResponse, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgStoreOverlayWasmResponse;
  fromJSON(object: any): MsgStoreOverlayWasmResponse;
  toJSON(message: MsgStoreOverlayWasmResponse): unknown;
  create(
    base?: DeepPartial<MsgStoreOverlayWasmResponse>
  ): MsgStoreOverlayWasmResponse;
  fromPartial(
    object: DeepPartial<MsgStoreOverlayWasmResponse>
  ): MsgStoreOverlayWasmResponse;
};
export declare const MsgInstantiateAndRegisterProxyContract: {
  encode(
    message: MsgInstantiateAndRegisterProxyContract,
    writer?: _m0.Writer
  ): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgInstantiateAndRegisterProxyContract;
  fromJSON(object: any): MsgInstantiateAndRegisterProxyContract;
  toJSON(message: MsgInstantiateAndRegisterProxyContract): unknown;
  create(
    base?: DeepPartial<MsgInstantiateAndRegisterProxyContract>
  ): MsgInstantiateAndRegisterProxyContract;
  fromPartial(
    object: DeepPartial<MsgInstantiateAndRegisterProxyContract>
  ): MsgInstantiateAndRegisterProxyContract;
};
export declare const MsgInstantiateAndRegisterProxyContractResponse: {
  encode(
    message: MsgInstantiateAndRegisterProxyContractResponse,
    writer?: _m0.Writer
  ): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgInstantiateAndRegisterProxyContractResponse;
  fromJSON(object: any): MsgInstantiateAndRegisterProxyContractResponse;
  toJSON(message: MsgInstantiateAndRegisterProxyContractResponse): unknown;
  create(
    base?: DeepPartial<MsgInstantiateAndRegisterProxyContractResponse>
  ): MsgInstantiateAndRegisterProxyContractResponse;
  fromPartial(
    object: DeepPartial<MsgInstantiateAndRegisterProxyContractResponse>
  ): MsgInstantiateAndRegisterProxyContractResponse;
};
export declare const MsgUpdateParams: {
  encode(message: MsgUpdateParams, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateParams;
  fromJSON(object: any): MsgUpdateParams;
  toJSON(message: MsgUpdateParams): unknown;
  create(base?: DeepPartial<MsgUpdateParams>): MsgUpdateParams;
  fromPartial(object: DeepPartial<MsgUpdateParams>): MsgUpdateParams;
};
export declare const MsgUpdateParamsResponse: {
  encode(_: MsgUpdateParamsResponse, writer?: _m0.Writer): _m0.Writer;
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgUpdateParamsResponse;
  fromJSON(_: any): MsgUpdateParamsResponse;
  toJSON(_: MsgUpdateParamsResponse): unknown;
  create(base?: DeepPartial<MsgUpdateParamsResponse>): MsgUpdateParamsResponse;
  fromPartial(_: DeepPartial<MsgUpdateParamsResponse>): MsgUpdateParamsResponse;
};
/** Msg service defines the wasm-storage tx gRPC methods. */
export interface Msg {
  /**
   * The StoreDataRequestWasm method stores a dr wasm in the wasm-storage
   * module.
   */
  StoreDataRequestWasm(
    request: MsgStoreDataRequestWasm
  ): Promise<MsgStoreDataRequestWasmResponse>;
  /**
   * The StoreOverlayWasm method stores an overlay wasm in the wasm-storage
   * module.
   */
  StoreOverlayWasm(
    request: MsgStoreOverlayWasm
  ): Promise<MsgStoreOverlayWasmResponse>;
  /**
   * The InstantiateAndRegisterProxyContract method instantiates the proxy
   * contract and registers it's address.
   */
  InstantiateAndRegisterProxyContract(
    request: MsgInstantiateAndRegisterProxyContract
  ): Promise<MsgInstantiateAndRegisterProxyContractResponse>;
  /** The UpdateParams method updates the module's parameters. */
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
}
export declare const MsgServiceName = "sedachain.wasm_storage.v1.Msg";
export declare class MsgClientImpl implements Msg {
  private readonly rpc;
  private readonly service;
  constructor(
    rpc: Rpc,
    opts?: {
      service?: string;
    }
  );
  StoreDataRequestWasm(
    request: MsgStoreDataRequestWasm
  ): Promise<MsgStoreDataRequestWasmResponse>;
  StoreOverlayWasm(
    request: MsgStoreOverlayWasm
  ): Promise<MsgStoreOverlayWasmResponse>;
  InstantiateAndRegisterProxyContract(
    request: MsgInstantiateAndRegisterProxyContract
  ): Promise<MsgInstantiateAndRegisterProxyContractResponse>;
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
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
