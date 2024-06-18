import { Command } from "commander";

import { spinnerSuccess, updateSpinnerText } from "../spinner.js";
import { issueDr } from "../../services/dr/tx.js";
import { getRpcOption, getDrContractAddress } from "../wasm/options.js";
import { ADDRESS, GAS_LIMIT } from "../../config.js";

export const issue = new Command("issue");
issue.description(
  "Issues a data request on the SEDA chain with given input parameters"
);
issue.argument("<dr-binary>", "Hash of the DR binary to execute");
issue.option(
  "--dr-args <string>",
  "Comma (,) seperated list to pass to the Data Request binary"
);
issue.option("--tally-binary <string>", "Hash of the Tally binary to execute");
issue.option(
  "--tally-args <string>",
  "Comma (,) seperated list to pass to the Tally binary"
);
issue.option("-c, --contract [string]", "Contract address");
issue.option("-r, --rpc [string]", "Tendermint/CometBFT RPC Endpoint");

issue.action(async () => {
  // Tendermint/CometBFT RPC endpoint
  const endpoint: string = getRpcOption(issue);
  // Address (if not defined, first wallet address will be selected)
  const address: string | undefined = issue.opts().address
    ? issue.opts().address
    : ADDRESS;
  const contractAddress = getDrContractAddress(issue);

  // Gas (default `GAS_LIMIT`)
  const gas: string = issue.opts().gas ? issue.opts().gas : GAS_LIMIT;

  const dr_binary_id = issue.args[0];
  const opts = issue.opts();
  const tally_binary_id = opts.tallyBinary;

  const drInputs = Buffer.from(opts.drArgs).toString("base64");
  const tallyInputs = Buffer.from(opts.tallyArgs).toString("base64");
  const memoNumber = Math.ceil(Math.random() * 10000);

  const dataRequest = {
    version: "0.0.1",
    dr_binary_id,
    dr_inputs: drInputs,
    gas_limit: "3000000",
    gas_price: "1",
    memo: base64Encode([memoNumber]),
    replication_factor: 1,
    tally_binary_id,
    tally_inputs: tallyInputs,
  };

  updateSpinnerText("Issuing Data Request...");

  const response = await issueDr(
    endpoint,
    contractAddress,
    dataRequest,
    address,
    gas
  );

  spinnerSuccess();
  console.log();
  console.table(response);
});

function base64Encode(value: number[]) {
  return Buffer.from(value).toString("base64");
}
