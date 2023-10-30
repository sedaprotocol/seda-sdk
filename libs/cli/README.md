# SEDA SDK CLI

Command Line Interface (CLI) for the SEDA SDK. Allows you to upload list and show information about Data Request binaries.

# Getting started

This guide assumes you have already a package.json in place and a wasm binary. If not you can use our [starter template](https://github.com/sedaprotocol/seda-sdk-starter-template), which already has all dependencies you need.

First add the SEDA SDK CLI to your `devDependencies`:

```sh
npm install -D @seda-protocol/cli
```

You can verify if the command is working by doing:

```sh
npx seda-sdk
```

## Configuring

You can configure the CLI through arguments or environment variables. However we require the `MNEMONIC` to be submitted as an environment variable. The CLI does read `.env` files.

The following environment variables are available:

```sh
# The URL to the Tendermint/CometBFT server
SEDA_RPC_ENDPOINT = "http://INSERT_TENDERMINT_RPC_URL"
# The Mnemonic that you use on the SEDA chain
SEDA_MNEMONIC = "<INSERT_YOUR_MNEMONIC>"
# (optional) The address you want to use for transactions. If not set it will get use the first derived address.
SEDA_ADDRESS = "sedahdgasyu34dyada8sd7983724d8asdsahge"
# (optional) The gas limit you want to attach, (defaults to: 100000)
SEDA_GAS_LIMIT = "100000"
```

# WASM commands

Commands that allow you to interact with the Data Request binaries.

## Uploading a Data Request binary

Allows you to upload a Data Request binary to the SEDA chain.

Example:

```sh
npx seda-sdk wasm upload <INSERT_PATH_TO_WASM> --rpc <INSERT_SEDA_CHAIN_RPC>
```

This will return the `wasm hash` which you can use for Data Requests.

You can apply the following options:
* --rpc - The SEDA chain RPC to use
* --gas - The amount of gas to attach to the transaction (default: 100000)

## Data Request binary details

Shows all the details of an uploaded Data Request binary. The Data Request binary id is the hash of the WASM binary (which you receive from the upload command).

Example:

```sh
npx seda-sdk wasm show <INSERT_DR_WASM_BINRAY_ID> --rpc <INSERT_SEDA_CHAIN_RPC>
```

You can apply the following options:
* --rpc - The SEDA chain RPC to use

## List Data Request binaries

Shows all the WASM binaries to the SEDA chain.

Example:

```sh
npx seda-sdk wasm list --rpc <INSERT_SEDA_CHAIN_RPC>
```

You can apply the following options:
* --rpc - The SEDA chain RPC to use
