import { QueryClient, createProtobufRpcClient } from '@cosmjs/stargate';
import { Comet38Client } from '@cosmjs/tendermint-rpc';
import { QueryConfig } from './config';

export async function createProtoQueryClient(config: QueryConfig) {
  const cometClient = await Comet38Client.connect(config.rpc);

  const queryClient = new QueryClient(cometClient);

  return createProtobufRpcClient(queryClient);
}
