import { Maybe } from 'true-myth';
import { getEnvOrFail } from '@dev-tools/utils/get-env';

export const RPC_ENV_KEY = 'SEDA_RPC_ENDPOINT';
const MNEMONIC_ENV_KEY = 'SEDA_MNEMONIC';

export type QueryConfig = {
  rpc: string;
};

export function buildQueryConfig(opts: Partial<QueryConfig>): QueryConfig {
  return { rpc: getFromOptsOrEnv('rpc', opts, RPC_ENV_KEY) };
}

export type SigningConfig = {
  rpc: string;
  mnemonic: string;
};

export function buildSigningConfig(
  opts: Partial<SigningConfig>
): SigningConfig {
  return {
    rpc: getFromOptsOrEnv('rpc', opts, RPC_ENV_KEY),
    mnemonic: getFromOptsOrEnv('mnemonic', opts, MNEMONIC_ENV_KEY),
  };
}

function getFromOptsOrEnv<
  K extends string,
  A extends Record<K, string | undefined>
>(key: K, opts: Partial<A>, envKey: string): string {
  return Maybe.of(opts[key]).match({
    Just(value) {
      return value as string;
    },
    Nothing() {
      return getEnvOrFail(envKey);
    },
  });
}
