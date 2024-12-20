// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               unknown
// source: sedachain/data_proxy/v1/genesis.proto

/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Params, ProxyConfig } from "./data_proxy";

/** GenesisState defines data_proxy module's genesis state. */
export interface GenesisState {
  params: Params | undefined;
  dataProxyConfigs: DataProxyConfig[];
  feeUpdateQueue: FeeUpdateQueueRecord[];
}

/** DataProxyConfigs define the data proxy entries in the registry. */
export interface DataProxyConfig {
  dataProxyPubkey: Uint8Array;
  config: ProxyConfig | undefined;
}

/** FeeUpdateQueueRecord defines an entry in the data proxy update queue. */
export interface FeeUpdateQueueRecord {
  dataProxyPubkey: Uint8Array;
  updateHeight: bigint;
}

function createBaseGenesisState(): GenesisState {
  return { params: undefined, dataProxyConfigs: [], feeUpdateQueue: [] };
}

export const GenesisState = {
  encode(message: GenesisState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.dataProxyConfigs) {
      DataProxyConfig.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.feeUpdateQueue) {
      FeeUpdateQueueRecord.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.params = Params.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.dataProxyConfigs.push(DataProxyConfig.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.feeUpdateQueue.push(FeeUpdateQueueRecord.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GenesisState {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      dataProxyConfigs: globalThis.Array.isArray(object?.dataProxyConfigs)
        ? object.dataProxyConfigs.map((e: any) => DataProxyConfig.fromJSON(e))
        : [],
      feeUpdateQueue: globalThis.Array.isArray(object?.feeUpdateQueue)
        ? object.feeUpdateQueue.map((e: any) => FeeUpdateQueueRecord.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    if (message.dataProxyConfigs?.length) {
      obj.dataProxyConfigs = message.dataProxyConfigs.map((e) => DataProxyConfig.toJSON(e));
    }
    if (message.feeUpdateQueue?.length) {
      obj.feeUpdateQueue = message.feeUpdateQueue.map((e) => FeeUpdateQueueRecord.toJSON(e));
    }
    return obj;
  },

  create(base?: DeepPartial<GenesisState>): GenesisState {
    return GenesisState.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    message.dataProxyConfigs = object.dataProxyConfigs?.map((e) => DataProxyConfig.fromPartial(e)) || [];
    message.feeUpdateQueue = object.feeUpdateQueue?.map((e) => FeeUpdateQueueRecord.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDataProxyConfig(): DataProxyConfig {
  return { dataProxyPubkey: new Uint8Array(0), config: undefined };
}

export const DataProxyConfig = {
  encode(message: DataProxyConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.dataProxyPubkey.length !== 0) {
      writer.uint32(10).bytes(message.dataProxyPubkey);
    }
    if (message.config !== undefined) {
      ProxyConfig.encode(message.config, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DataProxyConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDataProxyConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.dataProxyPubkey = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.config = ProxyConfig.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DataProxyConfig {
    return {
      dataProxyPubkey: isSet(object.dataProxyPubkey) ? bytesFromBase64(object.dataProxyPubkey) : new Uint8Array(0),
      config: isSet(object.config) ? ProxyConfig.fromJSON(object.config) : undefined,
    };
  },

  toJSON(message: DataProxyConfig): unknown {
    const obj: any = {};
    if (message.dataProxyPubkey.length !== 0) {
      obj.dataProxyPubkey = base64FromBytes(message.dataProxyPubkey);
    }
    if (message.config !== undefined) {
      obj.config = ProxyConfig.toJSON(message.config);
    }
    return obj;
  },

  create(base?: DeepPartial<DataProxyConfig>): DataProxyConfig {
    return DataProxyConfig.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DataProxyConfig>): DataProxyConfig {
    const message = createBaseDataProxyConfig();
    message.dataProxyPubkey = object.dataProxyPubkey ?? new Uint8Array(0);
    message.config = (object.config !== undefined && object.config !== null)
      ? ProxyConfig.fromPartial(object.config)
      : undefined;
    return message;
  },
};

function createBaseFeeUpdateQueueRecord(): FeeUpdateQueueRecord {
  return { dataProxyPubkey: new Uint8Array(0), updateHeight: 0n };
}

export const FeeUpdateQueueRecord = {
  encode(message: FeeUpdateQueueRecord, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.dataProxyPubkey.length !== 0) {
      writer.uint32(10).bytes(message.dataProxyPubkey);
    }
    if (message.updateHeight !== 0n) {
      if (BigInt.asIntN(64, message.updateHeight) !== message.updateHeight) {
        throw new globalThis.Error("value provided for field message.updateHeight of type int64 too large");
      }
      writer.uint32(16).int64(message.updateHeight.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeeUpdateQueueRecord {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeeUpdateQueueRecord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.dataProxyPubkey = reader.bytes();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.updateHeight = longToBigint(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FeeUpdateQueueRecord {
    return {
      dataProxyPubkey: isSet(object.dataProxyPubkey) ? bytesFromBase64(object.dataProxyPubkey) : new Uint8Array(0),
      updateHeight: isSet(object.updateHeight) ? BigInt(object.updateHeight) : 0n,
    };
  },

  toJSON(message: FeeUpdateQueueRecord): unknown {
    const obj: any = {};
    if (message.dataProxyPubkey.length !== 0) {
      obj.dataProxyPubkey = base64FromBytes(message.dataProxyPubkey);
    }
    if (message.updateHeight !== 0n) {
      obj.updateHeight = message.updateHeight.toString();
    }
    return obj;
  },

  create(base?: DeepPartial<FeeUpdateQueueRecord>): FeeUpdateQueueRecord {
    return FeeUpdateQueueRecord.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<FeeUpdateQueueRecord>): FeeUpdateQueueRecord {
    const message = createBaseFeeUpdateQueueRecord();
    message.dataProxyPubkey = object.dataProxyPubkey ?? new Uint8Array(0);
    message.updateHeight = object.updateHeight ?? 0n;
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
