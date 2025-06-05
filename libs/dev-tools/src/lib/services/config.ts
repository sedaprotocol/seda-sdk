import { getEnv, getEnvOrFail } from "@dev-tools/utils/get-env";
import { Maybe } from "true-myth";

export const RPC_ENV_KEY = "SEDA_RPC_ENDPOINT";
const MNEMONIC_ENV_KEY = "SEDA_MNEMONIC";
const SEDA_CORE_CONTRACT_ENV_KEY = "SEDA_CORE_CONTRACT";

export const AUTO_CORE_CONTRACT_VALUE = "auto";

export type QueryConfig = {
	rpc: string;
};

export function buildQueryConfig(opts: Partial<QueryConfig>): QueryConfig {
	return { rpc: getFromOptsOrEnvOrFail("rpc", opts, RPC_ENV_KEY) };
}

export type SigningConfig = {
	contract: string;
	rpc: string;
	mnemonic: string;
};

export function buildSigningConfig(
	opts: Partial<SigningConfig>,
): SigningConfig {
	return {
		rpc: getFromOptsOrEnvOrFail("rpc", opts, RPC_ENV_KEY),
		mnemonic: getFromOptsOrEnvOrFail("mnemonic", opts, MNEMONIC_ENV_KEY),
		contract: getFromOptsOrEnv(
			"contract",
			opts,
			SEDA_CORE_CONTRACT_ENV_KEY,
		).mapOr(AUTO_CORE_CONTRACT_VALUE, (t) => t),
	};
}

function getFromOptsOrEnvOrFail<
	K extends string,
	A extends Record<K, string | undefined>,
>(key: K, opts: Partial<A>, envKey: string): string {
	return Maybe.of(opts[key]).mapOrElse(
		() => getEnvOrFail(envKey),
		(t) => t as string,
	);
}

function getFromOptsOrEnv<
	K extends string,
	A extends Record<K, string | number | undefined>,
>(key: K, opts: Partial<A>, envKey: string): Maybe<string> {
	return Maybe.of(opts[key]).mapOrElse(
		() => getEnv(envKey),
		(t) => Maybe.just(String(t)),
	);
}
