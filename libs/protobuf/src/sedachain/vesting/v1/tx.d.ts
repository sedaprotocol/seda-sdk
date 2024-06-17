import _m0 from "protobufjs/minimal.js";
import { Coin } from "../../../cosmos/base/v1beta1/coin.js";
/** MsgCreateVestingAccount defines a message that creates a vesting account. */
export interface MsgCreateVestingAccount {
    fromAddress: string;
    toAddress: string;
    amount: Coin[];
    /** end of vesting as unix time (in seconds). */
    endTime: number;
    /** if true, leave funder field empty and disable clawback */
    disableClawback: boolean;
}
/**
 * MsgCreateVestingAccountResponse defines the CreateVestingAccount response
 * type.
 */
export interface MsgCreateVestingAccountResponse {
}
/** MsgClawback defines a message that returns the vesting funds to the funder. */
export interface MsgClawback {
    /** funder_address is the address which funded the account. */
    funderAddress: string;
    /** account_address is the address of the vesting to claw back from. */
    accountAddress: string;
}
/** MsgClawbackResponse defines the MsgClawback response type. */
export interface MsgClawbackResponse {
    clawedUnbonded: Coin[];
    clawedUnbonding: Coin[];
    clawedBonded: Coin[];
}
export declare const MsgCreateVestingAccount: {
    encode(message: MsgCreateVestingAccount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateVestingAccount;
    fromJSON(object: any): MsgCreateVestingAccount;
    toJSON(message: MsgCreateVestingAccount): unknown;
    create(base?: DeepPartial<MsgCreateVestingAccount>): MsgCreateVestingAccount;
    fromPartial(object: DeepPartial<MsgCreateVestingAccount>): MsgCreateVestingAccount;
};
export declare const MsgCreateVestingAccountResponse: {
    encode(_: MsgCreateVestingAccountResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateVestingAccountResponse;
    fromJSON(_: any): MsgCreateVestingAccountResponse;
    toJSON(_: MsgCreateVestingAccountResponse): unknown;
    create(base?: DeepPartial<MsgCreateVestingAccountResponse>): MsgCreateVestingAccountResponse;
    fromPartial(_: DeepPartial<MsgCreateVestingAccountResponse>): MsgCreateVestingAccountResponse;
};
export declare const MsgClawback: {
    encode(message: MsgClawback, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgClawback;
    fromJSON(object: any): MsgClawback;
    toJSON(message: MsgClawback): unknown;
    create(base?: DeepPartial<MsgClawback>): MsgClawback;
    fromPartial(object: DeepPartial<MsgClawback>): MsgClawback;
};
export declare const MsgClawbackResponse: {
    encode(message: MsgClawbackResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgClawbackResponse;
    fromJSON(object: any): MsgClawbackResponse;
    toJSON(message: MsgClawbackResponse): unknown;
    create(base?: DeepPartial<MsgClawbackResponse>): MsgClawbackResponse;
    fromPartial(object: DeepPartial<MsgClawbackResponse>): MsgClawbackResponse;
};
/** Msg defines the vesting Msg service. */
export interface Msg {
    /** CreateVestingAccount creates a new vesting account. */
    CreateVestingAccount(request: MsgCreateVestingAccount): Promise<MsgCreateVestingAccountResponse>;
    /** Clawback returns the vesting funds back to the funder. */
    Clawback(request: MsgClawback): Promise<MsgClawbackResponse>;
}
export declare const MsgServiceName = "sedachain.vesting.v1.Msg";
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    private readonly service;
    constructor(rpc: Rpc, opts?: {
        service?: string;
    });
    CreateVestingAccount(request: MsgCreateVestingAccount): Promise<MsgCreateVestingAccountResponse>;
    Clawback(request: MsgClawback): Promise<MsgClawbackResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
