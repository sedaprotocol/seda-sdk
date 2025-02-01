package process

import (
	"encoding/hex"
	"os"

	sedav1 "github.com/seda-protocol/seda-sdk/seda_v1"
)

func Args() []string {
	args := os.Args

	minArgCount := 2
	if IsTallyVmMode() {
		minArgCount = 4
	}

	if len(args) < minArgCount {
		Error([]byte("Missing arguments"))
	}
	return args
}

func GetInputs() []byte {
	args := Args()

	inputs, err := hex.DecodeString(args[1])
	if err != nil {
		Error([]byte(err.Error()))
	}
	return inputs
}

func Success(result []byte) {
	ExitWithResult(0, result)
}

func Error(result []byte) {
	ExitWithResult(1, result)
}

func ExitWithMessage(code uint8, message string) {
	ExitWithResult(code, []byte(message))
}

func ExitWithResult(code uint8, result []byte) {
	resultPtr, resultLen := sedav1.GetDataPtr(result)
	sedav1.ExecutionResult(resultPtr, resultLen)
	os.Exit(int(code))
}

func Exit(code uint8) {
	ExitWithResult(code, []byte{})
}
