# SEDA SDK dev tools

The SEDA dev tools includes a CLI to interact with the SEDA chain as well as a collection of useful functions that allow you to create scripts to test your data request binaries.

# CLI

Command Line Interface (CLI) for the SEDA SDK. Allows you to upload list and show information about Data Request binaries.

This guide assumes you have already a package.json in place and a wasm binary. If not you can use our [starter template](https://github.com/sedaprotocol/seda-request-starter-kit), which already has all dependencies you need.

First add the SEDA SDK dev tools to your `devDependencies`:

```sh
npm install -D @seda-protocol/dev-tools
```

You can verify if the command is working by doing:

```sh
npx seda-sdk
```

## Configuring

You can configure the CLI through arguments or environment variables. However we require the `MNEMONIC` to be submitted as an environment variable. The CLI reads `.env` files in the working directory.

The following environment variables can be provided:

```sh
# The URL to the SEDA RPC server
SEDA_RPC_ENDPOINT = "http://INSERT_COMET_RPC_URL"
# The Mnemonic that you use on the SEDA chain
SEDA_MNEMONIC = "<INSERT_YOUR_MNEMONIC>"
```

You can apply the following options to all CLI commands:

- --rpc - The SEDA chain RPC to use

## Oracle Program commands

Commands that allow you to interact with the Oracle Programs.

### Uploading an Oracle Program

Allows you to upload an Oracle Program to the SEDA chain.

Example:

```sh
npx seda-sdk oracle-program upload <INSERT_PATH_TO_WASM> --rpc <INSERT_SEDA_CHAIN_RPC>
```

This will return the `Oracle Program ID` which you can use for Data Requests.

You can apply the following options:

- --gas - The amount of gas to attach to the transaction. Either an integer or 'auto' to use an estimate based on a simulation. (default: auto)
- --gas-adjustment - Used to scale the gas estimate with gas 'auto'. (default: 1.3)
- --gas-price - Price per unit of gas in aseda. (default: 10000000000)

### Oracle Program details

Shows all the details of an uploaded Oracle Program. The Oracle Program id is the hash of the WASM binary (which you receive from the upload command).

Example:

```sh
npx seda-sdk oracle-program show <INSERT_ORACLE_PROGRAM_ID> --rpc <INSERT_SEDA_CHAIN_RPC>
```

### List Oracle Programs

Shows all the Oracle Programs to the SEDA chain.

Example:

```sh
npx seda-sdk oracle-program list --rpc <INSERT_SEDA_CHAIN_RPC>
```
