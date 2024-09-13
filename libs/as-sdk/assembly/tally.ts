import { JSON } from "json-as/assembly";
import { Bytes } from "./bytes";
import { jsonArrToUint8Array } from "./json-utils";
import Process from "./process";

const REVEALS_ARGUMENT_POSITION = 2;
const CONSENSUS_ARGUMENT_POSITION = 3;

@json
class RevealBody {
	salt!: u8[];
	exit_code!: u8;
	gas_used!: string;
	reveal!: u8[];
}

/**
 * A revealed report from an overlay node. Includes the exit code and output of the executed Oracle Program, as
 * well as some other data from the overlay node.
 *
 * @category Tally
 */
@json
export class RevealResult {
	/**
	 * Entropy added by the overlay node to prevent other overlay nodes from copying the result.
	 */
	salt!: Bytes;

	/**
	 * POSIX compatible exit code that was returned by the execution phase of the Oracle Program.
	 */
	exitCode!: u8;

	/**
	 * Gas units consumed by the overlay node while executing the Oracle Program.
	 */
	gasUsed!: string;

	/**
	 * The ouput of the execution phase of the Oracle Program.
	 */
	reveal!: Bytes;

	/**
	 * Flag indicating whether this reveal result was in consensus. See {@linkcode Tally.getUnfilteredReveals} to access
	 * all reveals, including the ones which were not in consensus.
	 */
	inConsensus!: boolean;
}

/**
 * Helper class to retrieve the reveal data submitted by the overlay nodes that participated in the Data Request execution.
 *
 * @category Tally
 */
export default class Tally {
	/** @hidden */
	private constructor() {}

	/**
	 * Get the reveal data from the Oracle Program execution phase. This method also includes reveals which were not in
	 * consensus. Use getReveals to only receive reveals which were in consensus.
	 * @see {@link getReveals}
	 * @returns All reveals from the Oracle Program execution phase.
	 */
	static getUnfilteredReveals(): RevealResult[] {
		const encodedReveals = Process.args().at(REVEALS_ARGUMENT_POSITION);
		const reveals = JSON.parse<RevealBody[]>(encodedReveals);

		const encodedConsensus = Process.args().at(CONSENSUS_ARGUMENT_POSITION);
		const consensus = JSON.parse<u8[]>(encodedConsensus);

		const revealsAmount = reveals.length;
		const consensusAmount = consensus.length;
		if (revealsAmount !== consensusAmount) {
			throw new Error(
				`Number of reveals (${revealsAmount}) does not equal number of consensus reports (${consensusAmount}).`,
			);
		}

		const revealResults: RevealResult[] = [];
		for (let index = 0; index < reveals.length; index++) {
			const reveal = reveals[index];

			revealResults.push({
				exitCode: reveal.exit_code,
				gasUsed: reveal.gas_used,
				reveal: Bytes.fromByteArray(jsonArrToUint8Array(reveal.reveal)),
				salt: Bytes.fromByteArray(jsonArrToUint8Array(reveal.salt)),
				inConsensus: consensus.at(index) === 0,
			});
		}

		return revealResults;
	}

	/**
	 * Get the reveal data from the Oracle Program execution phase over which consensus was reached.
	 * @returns The reveals which were in consensus
	 */
	static getReveals(): RevealResult[] {
		const revealResults = Tally.getUnfilteredReveals();

		return revealResults.filter((revealResult) => revealResult.inConsensus);
	}
}
