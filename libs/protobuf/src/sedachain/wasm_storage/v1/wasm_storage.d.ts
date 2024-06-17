import _m0 from "protobufjs/minimal.js";
/** WasmType is an enum for the type of wasm. */
export declare enum WasmType {
  /** WASM_TYPE_UNSPECIFIED - An unspecified kind of wasm. */
  WASM_TYPE_UNSPECIFIED = 0,
  /** WASM_TYPE_DATA_REQUEST - A wasm that is a data request. */
  WASM_TYPE_DATA_REQUEST = 1,
  /** WASM_TYPE_TALLY - A wasm that is a DR tally. */
  WASM_TYPE_TALLY = 2,
  /** WASM_TYPE_DATA_REQUEST_EXECUTOR - A wasm that is an overlay executor. */
  WASM_TYPE_DATA_REQUEST_EXECUTOR = 3,
  /** WASM_TYPE_RELAYER - A wasm that is an overlay relayer. */
  WASM_TYPE_RELAYER = 4,
  UNRECOGNIZED = -1,
}
export declare function wasmTypeFromJSON(object: any): WasmType;
export declare function wasmTypeToJSON(object: WasmType): string;
/** A Wasm msg. */
export interface Wasm {
  hash: Uint8Array;
  bytecode: Uint8Array;
  wasmType: WasmType;
  addedAt: Date | undefined;
  /**
   * ExpirationHeight represents the block height at which the data request
   * wasm will be pruned. The value of zero means no expiration.
   */
  expirationHeight: number;
}
/** Params to define the max wasm size allowed. */
export interface Params {
  maxWasmSize: number;
  /**
   * WasmTTL represents the number of blocks a wasm's life is extended when it's
   * created or used.
   */
  wasmTtl: number;
}
export declare const Wasm: {
  encode(message: Wasm, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): Wasm;
  fromJSON(object: any): Wasm;
  toJSON(message: Wasm): unknown;
  create(base?: DeepPartial<Wasm>): Wasm;
  fromPartial(object: DeepPartial<Wasm>): Wasm;
};
export declare const Params: {
  encode(message: Params, writer?: _m0.Writer): _m0.Writer;
  decode(input: _m0.Reader | Uint8Array, length?: number): Params;
  fromJSON(object: any): Params;
  toJSON(message: Params): unknown;
  create(base?: DeepPartial<Params>): Params;
  fromPartial(object: DeepPartial<Params>): Params;
};
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
