package tests

import (
	"encoding/hex"

	crypto "github.com/seda-protocol/seda-sdk/crypto"
	process "github.com/seda-protocol/seda-sdk/process"
)

func TestSecp256k1VerifyValid() {
	message := []byte("Hello, SEDA!")
	signature, err := hex.DecodeString("58376cc76f4d4959b0adf8070ecf0079db889915a75370f6e39a8451ba5be0c35f091fa4d2fda3ced5b6e6acd1dbb4a45f2c6a1e643622ee4cf8b802b373d38f")
	if err != nil {
		process.Error([]byte("Failed to decode signature"))
	}
	publicKey, err := hex.DecodeString("02a2bebd272aa28e410cc74cef28e5ce74a9ffc94caf817ed9bd23b01ce2068c7b")
	if err != nil {
		process.Error([]byte("Failed to decode public key"))
	}

	if crypto.Secp256k1Verify(message, signature, publicKey) {
		process.Success([]byte("valid secp256k1 signature"))
	} else {
		process.Error([]byte("invalid secp256k1 signature"))
	}
}

func TestSecp256k1VerifyInvalid() {
	message := []byte("Hello, this is an invalid message!")
	signature, err := hex.DecodeString("58376cc76f4d4959b0adf8070ecf0079db889915a75370f6e39a8451ba5be0c35f091fa4d2fda3ced5b6e6acd1dbb4a45f2c6a1e643622ee4cf8b802b373d38f")
	if err != nil {
		process.Error([]byte("Failed to decode signature"))
	}
	publicKey, err := hex.DecodeString("02a2bebd272aa28e410cc74cef28e5ce74a9ffc94caf817ed9bd23b01ce2068c7b")
	if err != nil {
		process.Error([]byte("Failed to decode public key"))
	}

	if crypto.Secp256k1Verify(message, signature, publicKey) {
		process.Success([]byte("valid secp256k1 signature"))
	} else {
		process.Error([]byte("invalid secp256k1 signature"))
	}
}

func TestKeccak256() {
	input := process.GetInputs()
	result := crypto.Keccak256(input)
	process.Success([]byte(hex.EncodeToString(result)))
}
