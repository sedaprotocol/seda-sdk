// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               unknown
// source: cosmos/auth/v1beta1/auth.proto

/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Any } from "../../../google/protobuf/any";

/**
 * BaseAccount defines a base account type. It contains all the necessary fields
 * for basic account functionality. Any custom account type should extend this
 * type for additional functionality (e.g. vesting).
 */
export interface BaseAccount {
  address: string;
  pubKey: Any | undefined;
  accountNumber: bigint;
  sequence: bigint;
}

/** ModuleAccount defines an account for modules that holds coins on a pool. */
export interface ModuleAccount {
  baseAccount: BaseAccount | undefined;
  name: string;
  permissions: string[];
}

/**
 * ModuleCredential represents a unclaimable pubkey for base accounts controlled by modules.
 *
 * Since: cosmos-sdk 0.47
 */
export interface ModuleCredential {
  /** module_name is the name of the module used for address derivation (passed into address.Module). */
  moduleName: string;
  /**
   * derivation_keys is for deriving a module account address (passed into address.Module)
   * adding more keys creates sub-account addresses (passed into address.Derive)
   */
  derivationKeys: Uint8Array[];
}

/** Params defines the parameters for the auth module. */
export interface Params {
  maxMemoCharacters: bigint;
  txSigLimit: bigint;
  txSizeCostPerByte: bigint;
  sigVerifyCostEd25519: bigint;
  sigVerifyCostSecp256k1: bigint;
}

function createBaseBaseAccount(): BaseAccount {
  return { address: "", pubKey: undefined, accountNumber: 0n, sequence: 0n };
}

export const BaseAccount = {
  encode(message: BaseAccount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.pubKey !== undefined) {
      Any.encode(message.pubKey, writer.uint32(18).fork()).ldelim();
    }
    if (message.accountNumber !== 0n) {
      if (BigInt.asUintN(64, message.accountNumber) !== message.accountNumber) {
        throw new globalThis.Error("value provided for field message.accountNumber of type uint64 too large");
      }
      writer.uint32(24).uint64(message.accountNumber.toString());
    }
    if (message.sequence !== 0n) {
      if (BigInt.asUintN(64, message.sequence) !== message.sequence) {
        throw new globalThis.Error("value provided for field message.sequence of type uint64 too large");
      }
      writer.uint32(32).uint64(message.sequence.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BaseAccount {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBaseAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.address = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.pubKey = Any.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.accountNumber = longToBigint(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.sequence = longToBigint(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BaseAccount {
    return {
      address: isSet(object.address) ? globalThis.String(object.address) : "",
      pubKey: isSet(object.pubKey) ? Any.fromJSON(object.pubKey) : undefined,
      accountNumber: isSet(object.accountNumber) ? BigInt(object.accountNumber) : 0n,
      sequence: isSet(object.sequence) ? BigInt(object.sequence) : 0n,
    };
  },

  toJSON(message: BaseAccount): unknown {
    const obj: any = {};
    if (message.address !== "") {
      obj.address = message.address;
    }
    if (message.pubKey !== undefined) {
      obj.pubKey = Any.toJSON(message.pubKey);
    }
    if (message.accountNumber !== 0n) {
      obj.accountNumber = message.accountNumber.toString();
    }
    if (message.sequence !== 0n) {
      obj.sequence = message.sequence.toString();
    }
    return obj;
  },

  create(base?: DeepPartial<BaseAccount>): BaseAccount {
    return BaseAccount.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<BaseAccount>): BaseAccount {
    const message = createBaseBaseAccount();
    message.address = object.address ?? "";
    message.pubKey = (object.pubKey !== undefined && object.pubKey !== null)
      ? Any.fromPartial(object.pubKey)
      : undefined;
    message.accountNumber = object.accountNumber ?? 0n;
    message.sequence = object.sequence ?? 0n;
    return message;
  },
};

function createBaseModuleAccount(): ModuleAccount {
  return { baseAccount: undefined, name: "", permissions: [] };
}

export const ModuleAccount = {
  encode(message: ModuleAccount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.baseAccount !== undefined) {
      BaseAccount.encode(message.baseAccount, writer.uint32(10).fork()).ldelim();
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    for (const v of message.permissions) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModuleAccount {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModuleAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.baseAccount = BaseAccount.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.permissions.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ModuleAccount {
    return {
      baseAccount: isSet(object.baseAccount) ? BaseAccount.fromJSON(object.baseAccount) : undefined,
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      permissions: globalThis.Array.isArray(object?.permissions)
        ? object.permissions.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: ModuleAccount): unknown {
    const obj: any = {};
    if (message.baseAccount !== undefined) {
      obj.baseAccount = BaseAccount.toJSON(message.baseAccount);
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.permissions?.length) {
      obj.permissions = message.permissions;
    }
    return obj;
  },

  create(base?: DeepPartial<ModuleAccount>): ModuleAccount {
    return ModuleAccount.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ModuleAccount>): ModuleAccount {
    const message = createBaseModuleAccount();
    message.baseAccount = (object.baseAccount !== undefined && object.baseAccount !== null)
      ? BaseAccount.fromPartial(object.baseAccount)
      : undefined;
    message.name = object.name ?? "";
    message.permissions = object.permissions?.map((e) => e) || [];
    return message;
  },
};

function createBaseModuleCredential(): ModuleCredential {
  return { moduleName: "", derivationKeys: [] };
}

export const ModuleCredential = {
  encode(message: ModuleCredential, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.moduleName !== "") {
      writer.uint32(10).string(message.moduleName);
    }
    for (const v of message.derivationKeys) {
      writer.uint32(18).bytes(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModuleCredential {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModuleCredential();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.moduleName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.derivationKeys.push(reader.bytes());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ModuleCredential {
    return {
      moduleName: isSet(object.moduleName) ? globalThis.String(object.moduleName) : "",
      derivationKeys: globalThis.Array.isArray(object?.derivationKeys)
        ? object.derivationKeys.map((e: any) => bytesFromBase64(e))
        : [],
    };
  },

  toJSON(message: ModuleCredential): unknown {
    const obj: any = {};
    if (message.moduleName !== "") {
      obj.moduleName = message.moduleName;
    }
    if (message.derivationKeys?.length) {
      obj.derivationKeys = message.derivationKeys.map((e) => base64FromBytes(e));
    }
    return obj;
  },

  create(base?: DeepPartial<ModuleCredential>): ModuleCredential {
    return ModuleCredential.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ModuleCredential>): ModuleCredential {
    const message = createBaseModuleCredential();
    message.moduleName = object.moduleName ?? "";
    message.derivationKeys = object.derivationKeys?.map((e) => e) || [];
    return message;
  },
};

function createBaseParams(): Params {
  return {
    maxMemoCharacters: 0n,
    txSigLimit: 0n,
    txSizeCostPerByte: 0n,
    sigVerifyCostEd25519: 0n,
    sigVerifyCostSecp256k1: 0n,
  };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.maxMemoCharacters !== 0n) {
      if (BigInt.asUintN(64, message.maxMemoCharacters) !== message.maxMemoCharacters) {
        throw new globalThis.Error("value provided for field message.maxMemoCharacters of type uint64 too large");
      }
      writer.uint32(8).uint64(message.maxMemoCharacters.toString());
    }
    if (message.txSigLimit !== 0n) {
      if (BigInt.asUintN(64, message.txSigLimit) !== message.txSigLimit) {
        throw new globalThis.Error("value provided for field message.txSigLimit of type uint64 too large");
      }
      writer.uint32(16).uint64(message.txSigLimit.toString());
    }
    if (message.txSizeCostPerByte !== 0n) {
      if (BigInt.asUintN(64, message.txSizeCostPerByte) !== message.txSizeCostPerByte) {
        throw new globalThis.Error("value provided for field message.txSizeCostPerByte of type uint64 too large");
      }
      writer.uint32(24).uint64(message.txSizeCostPerByte.toString());
    }
    if (message.sigVerifyCostEd25519 !== 0n) {
      if (BigInt.asUintN(64, message.sigVerifyCostEd25519) !== message.sigVerifyCostEd25519) {
        throw new globalThis.Error("value provided for field message.sigVerifyCostEd25519 of type uint64 too large");
      }
      writer.uint32(32).uint64(message.sigVerifyCostEd25519.toString());
    }
    if (message.sigVerifyCostSecp256k1 !== 0n) {
      if (BigInt.asUintN(64, message.sigVerifyCostSecp256k1) !== message.sigVerifyCostSecp256k1) {
        throw new globalThis.Error("value provided for field message.sigVerifyCostSecp256k1 of type uint64 too large");
      }
      writer.uint32(40).uint64(message.sigVerifyCostSecp256k1.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.maxMemoCharacters = longToBigint(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.txSigLimit = longToBigint(reader.uint64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.txSizeCostPerByte = longToBigint(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.sigVerifyCostEd25519 = longToBigint(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.sigVerifyCostSecp256k1 = longToBigint(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Params {
    return {
      maxMemoCharacters: isSet(object.maxMemoCharacters) ? BigInt(object.maxMemoCharacters) : 0n,
      txSigLimit: isSet(object.txSigLimit) ? BigInt(object.txSigLimit) : 0n,
      txSizeCostPerByte: isSet(object.txSizeCostPerByte) ? BigInt(object.txSizeCostPerByte) : 0n,
      sigVerifyCostEd25519: isSet(object.sigVerifyCostEd25519) ? BigInt(object.sigVerifyCostEd25519) : 0n,
      sigVerifyCostSecp256k1: isSet(object.sigVerifyCostSecp256k1) ? BigInt(object.sigVerifyCostSecp256k1) : 0n,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.maxMemoCharacters !== 0n) {
      obj.maxMemoCharacters = message.maxMemoCharacters.toString();
    }
    if (message.txSigLimit !== 0n) {
      obj.txSigLimit = message.txSigLimit.toString();
    }
    if (message.txSizeCostPerByte !== 0n) {
      obj.txSizeCostPerByte = message.txSizeCostPerByte.toString();
    }
    if (message.sigVerifyCostEd25519 !== 0n) {
      obj.sigVerifyCostEd25519 = message.sigVerifyCostEd25519.toString();
    }
    if (message.sigVerifyCostSecp256k1 !== 0n) {
      obj.sigVerifyCostSecp256k1 = message.sigVerifyCostSecp256k1.toString();
    }
    return obj;
  },

  create(base?: DeepPartial<Params>): Params {
    return Params.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Params>): Params {
    const message = createBaseParams();
    message.maxMemoCharacters = object.maxMemoCharacters ?? 0n;
    message.txSigLimit = object.txSigLimit ?? 0n;
    message.txSizeCostPerByte = object.txSizeCostPerByte ?? 0n;
    message.sigVerifyCostEd25519 = object.sigVerifyCostEd25519 ?? 0n;
    message.sigVerifyCostSecp256k1 = object.sigVerifyCostSecp256k1 ?? 0n;
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToBigint(long: Long) {
  return BigInt(long.toString());
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
