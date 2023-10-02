import { Command } from 'commander';
import { spinnerError, stopSpinner } from './spinner.js';
import { wasm } from './wasm/index.js';

export async function commandInit() {
  const program = new Command()
    .description('SEDA SDK Command Line Interface (CLI)')
    .version('0.0.1')
    .addHelpText('after', '\r')
    .addCommand(wasm)
    .option('-v, --verbose', 'verbose logging')
    .helpOption(undefined, 'display this help');

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
}
