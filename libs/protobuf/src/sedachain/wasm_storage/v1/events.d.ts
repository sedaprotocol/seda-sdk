import _m0 from "protobufjs/minimal.js";
import { WasmType } from "./wasm_storage.js";
/** The msg for storing a data request wasm. */
export interface EventStoreDataRequestWasm {
    hash: string;
    wasmType: WasmType;
    bytecode: Uint8Array;
}
/** The msg for storing a overlay wasm(i.e. relayer or executor) */
export interface EventStoreOverlayWasm {
    hash: string;
    wasmType: WasmType;
    bytecode: Uint8Array;
}
export declare const EventStoreDataRequestWasm: {
    encode(message: EventStoreDataRequestWasm, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EventStoreDataRequestWasm;
    fromJSON(object: any): EventStoreDataRequestWasm;
    toJSON(message: EventStoreDataRequestWasm): unknown;
    create(base?: DeepPartial<EventStoreDataRequestWasm>): EventStoreDataRequestWasm;
    fromPartial(object: DeepPartial<EventStoreDataRequestWasm>): EventStoreDataRequestWasm;
};
export declare const EventStoreOverlayWasm: {
    encode(message: EventStoreOverlayWasm, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EventStoreOverlayWasm;
    fromJSON(object: any): EventStoreOverlayWasm;
    toJSON(message: EventStoreOverlayWasm): unknown;
    create(base?: DeepPartial<EventStoreOverlayWasm>): EventStoreOverlayWasm;
    fromPartial(object: DeepPartial<EventStoreOverlayWasm>): EventStoreOverlayWasm;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
