import type { DataRequest } from "./create-dr-input";

export function calculateDrFunds(dataRequest: DataRequest): string {
	const price = BigInt(dataRequest.gas_price);

	const funds =
		BigInt(dataRequest.exec_gas_limit + dataRequest.tally_gas_limit) * price;

	console.log("[DEBUG]: calculateDrFunds ::: ", dataRequest);
	return funds.toString();
}
