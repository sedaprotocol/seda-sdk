package main

import (
	tests "github.com/seda-protocol/seda-sdk-integration-tests/tests"
	process "github.com/seda-protocol/seda-sdk/process"
)

func main() {
	args := string(process.GetInputs())

	switch args {
	case "testTallyVmMode":
		tests.TestTallyVmMode()
	case "testTallyVmHttp":
		tests.TestTallyVmHttp()
	case "testTallyVmReveals":
		tests.TestTallyVmReveals()
	case "testTallyVmRevealsFiltered":
		tests.TestTallyVmRevealsFiltered()
	case "testSecp256k1VerifyValid":
		tests.TestSecp256k1VerifyValid()
	case "testSecp256k1VerifyInvalid":
		tests.TestSecp256k1VerifyInvalid()
	case "testKeccak256":
		tests.TestKeccak256()
	case "testHttpRejection":
		tests.TestHttpRejection()
	case "testHttpSuccess":
		tests.TestHttpSuccess()
	case "testPostHttpSuccess":
		tests.TestPostHttpSuccess()
	case "testProxyHttpFetch":
		tests.TestProxyHttpFetch()
	case "testGenerateProxyMessage":
		tests.TestGenerateProxyMessage()
	default:
		process.Error([]byte("No argument given"))
	}
}
