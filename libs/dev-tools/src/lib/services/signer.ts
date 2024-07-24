import { DirectSecp256k1HdWallet, OfflineSigner } from '@cosmjs/proto-signing';
import {
  AUTO_CORE_CONTRACT_VALUE,
  SigningConfig,
  buildSigningConfig,
} from './config';
import { createWasmQueryClient } from '@dev-tools/services/wasm/query-client';

const BECH32_ADDRESS_PREFIX = 'seda';

export interface ISigner {
  getEndpoint: () => string;
  getSigner: () => OfflineSigner;
  getAddress: () => string;
  getCoreContractAddress: () => string;
}

export class Signer implements ISigner {
  private constructor(
    private endpoint: string,
    private signer: DirectSecp256k1HdWallet,
    private address: string,
    private coreContractAddress: string
  ) {}

  /**
   * Attempts to initialise a signer by parsing environment variables for config that is not
   * provided directly.
   *
   * @throws Error when initialising wallet or deriving address fails.
   */
  static async fromPartial(opts: Partial<SigningConfig>): Promise<Signer> {
    const config = buildSigningConfig(opts);

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
      prefix: BECH32_ADDRESS_PREFIX,
    });

    const contract = await resolveCoreContractAddress(config);

    const accounts = await wallet.getAccounts();
    if (accounts.length == 0) {
      throw Error('Address for given mnemonic does not exist');
    }

    const address = accounts[0].address;

    return new Signer(config.rpc, wallet, address, contract);
  }

  getSigner() {
    return this.signer;
  }

  getAddress() {
    return this.address;
  }

  getEndpoint() {
    return this.endpoint;
  }

  getCoreContractAddress() {
    return this.coreContractAddress;
  }
}

async function resolveCoreContractAddress(config: SigningConfig) {
  if (config.contract !== AUTO_CORE_CONTRACT_VALUE) {
    return config.contract;
  }

  const queryClient = await createWasmQueryClient(config);

  const response = await queryClient.CoreContractRegistry({});

  return response.address;
}
