import { JSON } from "json-as/assembly";
import { Bytes } from "./bytes";
import { jsonArrToUint8Array } from "./json-utils";
import Process from "./process";

const REVEALS_ARGUMENT_POSITION = 2;
const CONSENSUS_ARGUMENT_POSITION = 3;

@json
export class RevealBody {
	salt!: u8[];
	exit_code!: u8;
	gas_used!: string;
	reveal!: u8[];
}

@json
export class RevealResult {
	salt!: Bytes;
	exit_code!: u8;
	gas_used!: string;
	reveal!: Bytes;
	in_consensus!: u8;
}

export default class Tally {
	/**
	 * Get the reveal data from the Oracle Program execution phase. This method also includes reveals which were not in
	 * consensus. Use getReveals to only receive reveals which were in consensus.
	 * @see {@link getReveals}
	 * @returns All reveals from the Oracle Program execution phase.
	 */
	static getAllReveals(): RevealResult[] {
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
				exit_code: reveal.exit_code,
				gas_used: reveal.gas_used,
				reveal: Bytes.fromByteArray(jsonArrToUint8Array(reveal.reveal)),
				salt: Bytes.fromByteArray(jsonArrToUint8Array(reveal.salt)),
				in_consensus: consensus.at(index),
			});
		}

		return revealResults;
	}

	/**
	 * Get the reveal data from the Oracle Program execution phase over which consensus was reached.
	 * @returns The reveals which were in consensus
	 */
	static getReveals(): RevealResult[] {
		const revealResults = Tally.getAllReveals();

		return revealResults.filter(
			(revealResult) => revealResult.in_consensus === 0,
		);
	}
}
