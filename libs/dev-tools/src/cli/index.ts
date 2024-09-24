#!/usr/bin/env node
import { Command } from "commander";
import { version } from "../../package.json";
import { RPC_ENV_KEY } from "../lib/services/config";
import { oracleProgram } from "./oracle-program";
import { spinnerError, stopSpinner } from "./utils/spinner";

const program = new Command()
	.description("SEDA SDK Command Line Interface (CLI)")
	.version(version)
	.addHelpText("after", "\r")
	.addCommand(oracleProgram)
	.option(
		"-r, --rpc [string]",
		`SEDA CometBFT RPC Endpoint. Attempts to reads '${RPC_ENV_KEY}' env variable if not passed.`,
	)
	.option("-v, --verbose", "verbose logging")
	.helpOption(undefined, "Display this help");

process.on("unhandledRejection", (err: Error) => {
	spinnerError();
	stopSpinner();

	if (program.opts().verbose) {
		console.error(err.stack);
	} else {
		console.error("\nError: ", err.message);
	}
	program.error("", { exitCode: 1 });
});

program.parse(process.argv);
