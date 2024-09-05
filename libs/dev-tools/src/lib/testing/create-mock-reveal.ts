export type RevealInput = {
	/**
	 * The exit code of the data request execution on the overlay node. 0 indicates success, any other value is
	 * considered an error.
	 */
	exitCode: number;
	/**
	 * Gas consumed by data request execution on the overlay node.
	 */
	gasUsed: number;
	/**
	 * JSON string containing the output of the data request WASM binary.
	 */
	result: string;
};

const encoder = new TextEncoder();
const MOCK_SALT = "seda_sdk";
const MOCK_SALT_BYTES = [...encoder.encode(MOCK_SALT)];

export function createMockReveal(input: RevealInput) {
	const resultBytes = encoder.encode(input.result);

	return {
		salt: MOCK_SALT_BYTES,
		exit_code: input.exitCode,
		gas_used: input.gasUsed.toString(),
		reveal: [...resultBytes],
	};
}

export function createMockReveals(inputs: RevealInput[]) {
	return inputs.map((input) => createMockReveal(input));
}
