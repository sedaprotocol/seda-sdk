import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { BECH32_ADDRESS_PREFIX, loadConfig } from "./config.js";
import { SigningStargateClient } from "@cosmjs/stargate";
import { Maybe } from "true-myth";

export class Signer {
  public client: Maybe<SigningStargateClient> = Maybe.nothing();
  public account: Maybe<string> = Maybe.nothing();
  public coreContractAddress: Maybe<string> = Maybe.nothing();

  constructor(
    public signer: DirectSecp256k1HdWallet,
    public rpcEndpoint: string
  ) {}

  async init() {
    this.client = Maybe.just(await this.getCosmosClient());
    this.account = Maybe.just(await this.getAccount());
  }

  private async getAccount() {
    const accounts = await this.signer.getAccounts();

    if (accounts.length == 0) {
      throw Error("Address for given mnemonics does not exist");
    }

    return accounts[0].address;
  }

  private async getCosmosClient(): Promise<SigningStargateClient> {
    return await SigningStargateClient.connectWithSigner(
      this.rpcEndpoint,
      this.signer
    );
  }

  static async fromEnv(): Promise<Signer> {
    const config = loadConfig();

    const signer = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
      prefix: BECH32_ADDRESS_PREFIX,
    });

    const result = new Signer(signer, config.rpcEndpoint);
    await result.init();
    return result;
  }
}
