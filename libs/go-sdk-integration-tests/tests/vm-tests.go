package tests

import (
	"github.com/seda-protocol/seda-sdk/http"
	"github.com/seda-protocol/seda-sdk/process"
)

func TestTallyVmMode() {
	if process.IsDrVmMode() {
		process.Error([]byte("dr"))
	} else {
		process.Success([]byte("tally"))
	}
}

func TestTallyVmHttp() {
	response := http.HttpFetch("https://api.binance.com/api/v3/ticker/price?symbol=eth-usdt", nil)

	if response.IsOk() {
		process.Error([]byte("this should not be allowed in tally mode"))
		return
	}

	process.Success(response.Bytes)
}
