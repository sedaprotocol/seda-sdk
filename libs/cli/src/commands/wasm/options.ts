import { Command } from "commander";
import { RPC_ENDPOINT, CONTRACT_ADDRESS } from "../../config.js";

export function getRpcOption(command: Command) {
  if (!command.opts().rpc && !RPC_ENDPOINT) {
    throw Error(
      "Tendermint/CometBFT RPC Endpoint must be provided (with --rpc option or env var)"
    );
  }
  return command.opts().rpc ? command.opts().rpc : RPC_ENDPOINT;
}

export function getDrContractAddress(command: Command) {
  if (!command.opts().contract && !CONTRACT_ADDRESS) {
    throw Error(
      "Contract address must be provided (with --contract option or env var)"
    );
  }
  return command.opts().contract ? command.opts().contract : CONTRACT_ADDRESS;
}
