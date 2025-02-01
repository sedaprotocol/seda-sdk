package tally

import "github.com/seda-protocol/seda-sdk/seda_v1"

type RevealBody struct {
	Salt     seda_v1.ByteArray `json:"salt"`
	ExitCode uint8             `json:"exit_code"`
	GasUsed  uint64            `json:"gas_used"`
	Reveal   seda_v1.ByteArray `json:"reveal"`
}

type RevealResult struct {
	Body        RevealBody `json:"body"`
	InConsensus bool       `json:"in_consensus"`
}
