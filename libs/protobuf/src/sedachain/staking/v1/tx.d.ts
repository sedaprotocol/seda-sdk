import _m0 from "protobufjs/minimal.js";
import { Coin } from "../../../cosmos/base/v1beta1/coin.js";
import { CommissionRates, Description } from "../../../cosmos/staking/v1beta1/staking.js";
import { Any } from "../../../google/protobuf/any.js";
/** MsgCreateValidator defines a SDK message for creating a new validator. */
export interface MsgCreateValidatorWithVRF {
    description: Description | undefined;
    commission: CommissionRates | undefined;
    minSelfDelegation: string;
    /**
     * Deprecated: Use of Delegator Address in MsgCreateValidator is deprecated.
     * The validator address bytes and delegator address bytes refer to the same
     * account while creating validator (defer only in bech32 notation).
     *
     * @deprecated
     */
    delegatorAddress: string;
    validatorAddress: string;
    pubkey: Any | undefined;
    value: Coin | undefined;
    vrfPubkey: Any | undefined;
}
/** MsgCreateValidatorResponse defines the Msg/CreateValidator response type. */
export interface MsgCreateValidatorWithVRFResponse {
}
export declare const MsgCreateValidatorWithVRF: {
    encode(message: MsgCreateValidatorWithVRF, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateValidatorWithVRF;
    fromJSON(object: any): MsgCreateValidatorWithVRF;
    toJSON(message: MsgCreateValidatorWithVRF): unknown;
    create(base?: DeepPartial<MsgCreateValidatorWithVRF>): MsgCreateValidatorWithVRF;
    fromPartial(object: DeepPartial<MsgCreateValidatorWithVRF>): MsgCreateValidatorWithVRF;
};
export declare const MsgCreateValidatorWithVRFResponse: {
    encode(_: MsgCreateValidatorWithVRFResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateValidatorWithVRFResponse;
    fromJSON(_: any): MsgCreateValidatorWithVRFResponse;
    toJSON(_: MsgCreateValidatorWithVRFResponse): unknown;
    create(base?: DeepPartial<MsgCreateValidatorWithVRFResponse>): MsgCreateValidatorWithVRFResponse;
    fromPartial(_: DeepPartial<MsgCreateValidatorWithVRFResponse>): MsgCreateValidatorWithVRFResponse;
};
/** Msg defines the staking Msg service. */
export interface Msg {
    /** CreateValidatorWithVRF defines a method for creating a new validator. */
    CreateValidatorWithVRF(request: MsgCreateValidatorWithVRF): Promise<MsgCreateValidatorWithVRFResponse>;
}
export declare const MsgServiceName = "sedachain.staking.v1.Msg";
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    private readonly service;
    constructor(rpc: Rpc, opts?: {
        service?: string;
    });
    CreateValidatorWithVRF(request: MsgCreateValidatorWithVRF): Promise<MsgCreateValidatorWithVRFResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
