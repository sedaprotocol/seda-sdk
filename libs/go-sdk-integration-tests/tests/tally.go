package tests

import (
	"encoding/json"
	"fmt"

	"github.com/seda-protocol/seda-sdk/process"
	"github.com/seda-protocol/seda-sdk/tally"
)

func TestTallyVmReveals() {
	reveals, err := tally.GetUnfilteredReveals()
	if err != nil {
		process.Error([]byte(fmt.Sprintf("Error getting reveals: %v", err)))
	}

	encodedReveals, err := json.Marshal(reveals)
	if err != nil {
		process.Error([]byte(fmt.Sprintf("Error marshalling reveals: %v", err)))
	}

	process.Success(encodedReveals)
}

func TestTallyVmRevealsFiltered() {
	reveals, err := tally.GetFilteredReveals()
	if err != nil {
		process.Error([]byte(fmt.Sprintf("Error getting reveals: %v", err)))
	}

	encodedReveals, err := json.Marshal(reveals)
	if err != nil {
		process.Error([]byte(fmt.Sprintf("Error marshalling reveals: %v", err)))
	}

	process.Success(encodedReveals)
}
