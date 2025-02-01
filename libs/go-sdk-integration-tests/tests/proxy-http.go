package tests

import (
	"encoding/hex"

	"github.com/seda-protocol/seda-sdk/http"
	"github.com/seda-protocol/seda-sdk/process"
)

func TestProxyHttpFetch() {
	response := http.ProxyHttpFetch("http://localhost:5384/proxy/planets/1", nil, nil)

	if response.IsOk() {
		process.Success(response.Bytes)
	}

	process.Error(response.Bytes)
}

func TestGenerateProxyMessage() {
	response := http.GenerateProxyHttpSigningMessage("https://example.com", "GET", nil, []byte("{\"name\":\"data-proxy\"}"))

	process.Success([]byte(hex.EncodeToString(response)))
}
