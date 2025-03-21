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
	 * The output as determind by the `Process.succes()` call in the execution phase.
	 */
	result: string | Buffer;
};

const encoder = new TextEncoder();

export function createMockReveal(input: RevealInput) {
	const resultBytes = inputToBytes(input.result);

	return {
		dr_block_height: 1,
		exit_code: input.exitCode,
		gas_used: input.gasUsed,
		reveal: [...resultBytes],
	};
}

export function createMockReveals(inputs: RevealInput[]) {
	return inputs.map((input) => createMockReveal(input));
}

function inputToBytes(input: string | Buffer): Uint8Array {
	if (typeof input === "string") {
		return encoder.encode(input);
	}

	return Uint8Array.from(input);
}
