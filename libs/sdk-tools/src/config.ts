import { config } from 'dotenv';

function getEnvOrFail(key: string): string {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`No environment variable "${key}" found.`);
  }

  return value;
}

export function loadConfig() {
  config();
  config({
    path: `${process.cwd}/.env`
  });

  return {
    mnemonic: getEnvOrFail('SEDA_MNEMONIC'),
    rpcEndpoint: getEnvOrFail('SEDA_RPC_ENDPOINT'),
  };
}

export const BECH32_ADDRESS_PREFIX = 'seda';
