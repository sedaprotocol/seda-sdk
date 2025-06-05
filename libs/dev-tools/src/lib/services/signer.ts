import { stringToPath } from "@cosmjs/crypto";
import {
	AccountData,
	DirectSecp256k1HdWallet,
	type OfflineSigner,
} from "@cosmjs/proto-signing";
import { createWasmStorageQueryClient } from "@dev-tools/services/oracle-program/query-client";
import { tryAsync } from "@seda-protocol/utils";
import {
	AUTO_CORE_CONTRACT_VALUE,
	type SigningConfig,
	buildSigningConfig,
} from "./config";

const BECH32_ADDRESS_PREFIX = "seda";
// DirectSecp256k1HdWallet uses BIP-44 paths with format m/44'/118'/account'/0/address
// where account and address indices start at 0
const DEFAULT_HD_PATH_WITHOUT_INDEX = "m/44'/118'/0'/0/";

export interface ISigner {
	getEndpoint: () => string;
	getSigner: () => OfflineSigner;
	getAddress: () => string;
	getCoreContractAddress: () => string;
}

const DEFAULT_ADDRESS_INDEX = 0;

export class Signer implements ISigner {
	private constructor(
		private endpoint: string,
		private signer: DirectSecp256k1HdWallet,
		private addresses: string[],
		private coreContractAddress: string,
		private addressIndex: number,
	) {}

	/**
	 * Attempts to initialise a signer by parsing environment variables for config that is not
	 * provided directly.
	 *
	 * @param opts - The configuration for the signer.
	 * @param addressIndex - The index of the address to use. Defaults to 0.
	 * @throws Error when initialising wallet or deriving address fails.
	 */
	static async fromPartial(
		opts: Partial<SigningConfig>,
		addressIndex = DEFAULT_ADDRESS_INDEX,
	): Promise<Signer> {
		if (addressIndex < 0) {
			throw Error("Address index must be greater than or equal to 0");
		}

		const config = buildSigningConfig(opts);

		const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
			prefix: BECH32_ADDRESS_PREFIX,
			hdPaths: getHdPaths(addressIndex),
		});

		const contract = await resolveCoreContractAddress(config);

		const accounts = await wallet.getAccounts();
		if (accounts.length === 0) {
			throw Error("Address for given mnemonic does not exist");
		}

		const addresses = accounts.map((account) => account.address);

		return new Signer(config.rpc, wallet, addresses, contract, addressIndex);
	}

	getSigner() {
		return this.signer;
	}

	getAddress() {
		return this.addresses[this.addressIndex];
	}

	getEndpoint() {
		return this.endpoint;
	}

	getCoreContractAddress() {
		return this.coreContractAddress;
	}
}

/**
 * Returns the HD paths required to derive the given address index.
 *
 * @param addressIndex - The index of the address to derive. Must be greater than or equal to 0.
 * @returns The HD paths required to derive the given address index.
 */
function getHdPaths(addressIndex: number) {
	// Passing undefined to the wallet constructor will use the default HD path
	if (addressIndex <= 0) {
		return undefined;
	}

	return Array.from({ length: addressIndex + 1 }, (_, i) =>
		stringToPath(`${DEFAULT_HD_PATH_WITHOUT_INDEX}${i}`),
	);
}

async function resolveCoreContractAddress(config: SigningConfig) {
	if (config.contract !== AUTO_CORE_CONTRACT_VALUE) {
		return config.contract;
	}

	const queryClient = await createWasmStorageQueryClient(config);

	const response = await tryAsync(async () =>
		queryClient.CoreContractRegistry({}),
	);

	if (response.isErr) {
		throw Error(
			"No core contract set on chain. Please provide a SEDA_CORE_CONTRACT address manually.",
		);
	}

	return response.value.address;
}
