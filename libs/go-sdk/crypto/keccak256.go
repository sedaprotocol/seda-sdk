package crypto

import (
	sedav1 "github.com/seda-protocol/seda-sdk/seda_v1"
)

func Keccak256(message []byte) []byte {
	messagePtr, messageLen := sedav1.GetDataPtr(message)

	resultLength := sedav1.Keccak256(uintptr(messagePtr), messageLen)
	resultData := sedav1.GetResultData(resultLength)

	return resultData
}
