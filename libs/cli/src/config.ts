import { config } from 'dotenv';

config();

export const BECH32_ADDRESS_PREFIX = 'seda';
export const RPC_ENDPOINT = process.env.RPC_ENDPOINT;
export const MNEMONICS = process.env.MNEMONICS;
export const ADDRESS = process.env.ADDRESS;
export const GAS_LIMIT = process.env.GAS_LIMIT ?? '100000';
