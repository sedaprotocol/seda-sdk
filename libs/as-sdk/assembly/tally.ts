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
	static getReveals(): RevealResult[] {
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

	static getConsensusReveals(): RevealResult[] {
		const revealResults = Tally.getReveals();

		return revealResults.filter(
			(revealResult) => revealResult.in_consensus === 0,
		);
	}
}
