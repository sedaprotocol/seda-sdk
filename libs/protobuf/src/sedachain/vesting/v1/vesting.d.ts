import _m0 from "protobufjs/minimal.js";
import { ContinuousVestingAccount } from "../../../cosmos/vesting/v1beta1/vesting.js";
/**
 * ClawbackContinuousVestingAccount implements the VestingAccount interface.
 * It wraps a ContinuousVestingAccount provided by Cosmos SDK to provide
 * additional support for clawback.
 */
export interface ClawbackContinuousVestingAccount {
    baseVestingAccount: ContinuousVestingAccount | undefined;
    funderAddress: string;
}
export declare const ClawbackContinuousVestingAccount: {
    encode(message: ClawbackContinuousVestingAccount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ClawbackContinuousVestingAccount;
    fromJSON(object: any): ClawbackContinuousVestingAccount;
    toJSON(message: ClawbackContinuousVestingAccount): unknown;
    create(base?: DeepPartial<ClawbackContinuousVestingAccount>): ClawbackContinuousVestingAccount;
    fromPartial(object: DeepPartial<ClawbackContinuousVestingAccount>): ClawbackContinuousVestingAccount;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
