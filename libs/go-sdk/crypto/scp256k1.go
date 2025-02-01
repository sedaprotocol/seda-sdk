package crypto

import (
	"strconv"

	process "github.com/seda-protocol/seda-sdk/process"
	sedav1 "github.com/seda-protocol/seda-sdk/seda_v1"
)

func Secp256k1Verify(message, signature, publicKey []byte) bool {
	messagePtr, messageLen := sedav1.GetDataPtr(message)
	signaturePtr, signatureLen := sedav1.GetDataPtr(signature)
	publicKeyPtr, publicKeyLen := sedav1.GetDataPtr(publicKey)

	resultLength := sedav1.Secp256k1Verify(messagePtr, uint64(messageLen), signaturePtr, signatureLen, publicKeyPtr, publicKeyLen)

	resultData := sedav1.GetResultData(resultLength)

	var result byte
	if len(resultData) == 0 {
		result = 0
	} else {
		result = resultData[0]
	}

	if result > 1 {
		process.Error([]byte("Secp256k1Verify returned invalid bool in u8: " + strconv.FormatUint(uint64(result), 10)))
	}

	return result == 1
}
