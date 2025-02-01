package tally

import (
	"encoding/json"
	"fmt"

	"github.com/seda-protocol/seda-sdk/process"
)

func GetUnfilteredReveals() ([]RevealResult, error) {
	args := process.Args()

	encodedReveals := args[2]
	println(encodedReveals)
	encodedConsensus := args[3]

	var reveals []RevealBody
	err := json.Unmarshal([]byte(encodedReveals), &reveals)
	if err != nil {
		return nil, err
	}

	// Consensus is provided by the VM, if there is an error unmarshalling or the length is incorrect it means
	// the VM is not behaving as expected and we should fail loudly.
	var consensus []int
	err = json.Unmarshal([]byte(encodedConsensus), &consensus)
	if err != nil {
		process.Error([]byte(fmt.Sprintf("Error unmarshalling consensus: %v", err)))
	}

	if len(reveals) != len(consensus) {
		process.Error([]byte(fmt.Sprintf("Number of reveals (%d) does not equal number of consensus reports (%d).", len(reveals), len(consensus))))
	}

	revealResults := []RevealResult{}
	for i, reveal := range reveals {
		revealResults = append(revealResults, RevealResult{
			InConsensus: consensus[i] == 0,
			Body:        reveal,
		})
	}

	return revealResults, nil
}

func GetFilteredReveals() ([]RevealResult, error) {
	reveals, err := GetUnfilteredReveals()
	if err != nil {
		return nil, err
	}

	filteredReveals := []RevealResult{}
	for _, reveal := range reveals {
		if reveal.InConsensus {
			filteredReveals = append(filteredReveals, reveal)
		}
	}

	return filteredReveals, nil
}
