import { config } from 'dotenv';

config();
config({
  path: `${process.cwd()}/.env`,
});

export const BECH32_ADDRESS_PREFIX = 'seda';
export const RPC_ENDPOINT = process.env.SEDA_RPC_ENDPOINT;
export const MNEMONIC = process.env.SEDA_MNEMONIC;
export const ADDRESS = process.env.SEDA_ADDRESS;
export const GAS_LIMIT = process.env.SEDA_GAS_LIMIT ?? '100000';
