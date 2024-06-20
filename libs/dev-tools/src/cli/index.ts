#!/usr/bin/env node
import { Command } from 'commander';
import { spinnerError, stopSpinner } from './utils/spinner';
import { wasm } from './wasm';
import { version } from '../../package.json';
import { RPC_ENV_KEY } from '../lib/services/config';

const program = new Command()
  .description('SEDA SDK Command Line Interface (CLI)')
  .version(version)
  .addHelpText('after', '\r')
  .addCommand(wasm)
  .option(
    '-r, --rpc [string]',
    `SEDA CometBFT RPC Endpoint. Attempts to reads '${RPC_ENV_KEY}' env variable if not passed.`
  )
  .option('-v, --verbose', 'verbose logging')
  .helpOption(undefined, 'Display this help');

process.on('unhandledRejection', function (err: Error) {
  spinnerError();
  stopSpinner();

  if (program.opts().verbose) {
    console.error(err.stack);
  } else {
    console.error('\nError: ', err.message);
  }
  program.error('', { exitCode: 1 });
});

program.parse(process.argv);
