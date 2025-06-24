import type { DataRequest } from "./create-dr-input";

export function calculateDrFunds(dataRequest: DataRequest): string {
	const price = BigInt(dataRequest.posted_dr.gas_price);

	const funds =
		BigInt(
			dataRequest.posted_dr.exec_gas_limit +
				dataRequest.posted_dr.tally_gas_limit,
		) * price;

	return funds.toString();
}
