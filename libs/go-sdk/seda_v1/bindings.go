package seda_v1

//go:wasm-module seda_v1
//export http_fetch
func HttpFetch(actionPtr uintptr, actionLength uint32) uint32

//go:wasm-module seda_v1
//export proxy_http_fetch
func ProxyHttpFetch(actionPtr uintptr, actionLength uint32) uint32

//go:wasm-module seda_v1
//export call_result_write
func CallResultWrite(result uintptr, resultLength uint32)

//go:wasm-module seda_v1
//export execution_result
func ExecutionResult(result uintptr, resultLength uint32)

//go:wasm-module seda_v1
//export secp256k1_verify
func Secp256k1Verify(message uintptr, messageLength uint64, signature uintptr, signatureLength uint32, publicKey uintptr, publicKeyLength uint32) uint8

//go:wasm-module seda_v1
//export keccak256
func Keccak256(message uintptr, messageLength uint32) uint32
