import {
	DEFAULT_ADJUSTMENT_FACTOR,
	DEFAULT_GAS,
	DEFAULT_GAS_PRICE,
	type GasOptions,
} from "@dev-tools/services/gas-options";
import type { Command } from "commander";

export function addGasOptionsToCommand(command: Command): Command {
	command.option(
		"-g, --gas [string]",
		'Transaction gas limit. Either an absolute integer or the string "auto".',
		DEFAULT_GAS,
	);
	command.option(
		"--gas-adjustment [number]",
		'Used to scale the gas estimate with gas "auto".',
		DEFAULT_ADJUSTMENT_FACTOR.toString(),
	);
	command.option(
		"--gas-price [integer]",
		"Price per unit of gas in aseda.",
		DEFAULT_GAS_PRICE,
	);

	return command;
}

export function getGasOptionsFromCommand(command: Command): GasOptions {
	const opts = command.optsWithGlobals();

	return {
		gas: opts.gas,
		adjustmentFactor: opts.gasAdjustment,
		gasPrice: opts.gasPrice,
	};
}
