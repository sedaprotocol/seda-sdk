import { Command } from 'commander';
import { RPC_ENDPOINT } from '../../config.js';

export function getRpcOption(command: Command) {
  if (!command.opts().rpc && !RPC_ENDPOINT) {
    throw Error(
      'Tendermint/CometBFT RPC Endpoint must be provided (with --rpc option or env var)'
    );
  }
  return command.opts().rpc ? command.opts().rpc : RPC_ENDPOINT;
}
