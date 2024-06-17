import _m0 from "protobufjs/minimal.js";
import { Any } from "../../../google/protobuf/any.js";
/** ValidatorVRF is the randomness validator's VRF key information */
export interface ValidatorVRF {
    /**
     * operator_address defines the address of the validator's operator; bech
     * encoded in JSON.
     */
    operatorAddress: string;
    /** vrf_pubkey is the public key of the validator's VRF key pair */
    vrfPubkey: Any | undefined;
}
export declare const ValidatorVRF: {
    encode(message: ValidatorVRF, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ValidatorVRF;
    fromJSON(object: any): ValidatorVRF;
    toJSON(message: ValidatorVRF): unknown;
    create(base?: DeepPartial<ValidatorVRF>): ValidatorVRF;
    fromPartial(object: DeepPartial<ValidatorVRF>): ValidatorVRF;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
