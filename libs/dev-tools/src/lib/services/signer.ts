import { DirectSecp256k1HdWallet, OfflineSigner } from '@cosmjs/proto-signing';
import { SigningConfig, buildSigningConfig } from './config';

const BECH32_ADDRESS_PREFIX = 'seda';

export interface ISigner {
  getEndpoint: () => string;
  getSigner: () => OfflineSigner;
  getAddress: () => string;
}

export class Signer implements ISigner {
  private constructor(
    private endpoint: string,
    private signer: DirectSecp256k1HdWallet,
    private address: string
  ) {}

  /**
   * Attempts to initialise a signer by parsing environment variables for config that is not
   * provided directly.
   *
   * @throws Error when initialising wallet or deriving address fails.
   */
  static async fromPartial(opts: Partial<SigningConfig>): Promise<Signer> {
    const { mnemonic, rpc } = buildSigningConfig(opts);

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: BECH32_ADDRESS_PREFIX,
    });

    const accounts = await wallet.getAccounts();
    if (accounts.length == 0) {
      throw Error('Address for given mnemonic does not exist');
    }

    const address = accounts[0].address;

    return new Signer(rpc, wallet, address);
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
}
