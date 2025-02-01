package http

import (
	"encoding/json"
	"fmt"

	"github.com/seda-protocol/seda-sdk/crypto"
	process "github.com/seda-protocol/seda-sdk/process"
	"github.com/seda-protocol/seda-sdk/promise"
	sedav1 "github.com/seda-protocol/seda-sdk/seda_v1"
)

type proxyHttpFetchAction struct {
	Url       string           `json:"url"`
	PublicKey string           `json:"public_key,omitempty"`
	Options   HttpFetchOptions `json:"options"`
}

type publicKey struct {
	key string
}

func NewPublicKey(key string) *publicKey {
	return &publicKey{key: key}
}

func ProxyHttpFetch(url string, pubKey *publicKey, options *HttpFetchOptions) HttpFetchResponse {
	if options == nil {
		options = &HttpFetchOptions{
			Method: "GET",
		}
	}

	if !IsValidHttpMethod(options.Method) {
		process.Error([]byte(fmt.Sprintf("invalid http method: %s", options.Method)))
	}

	publicKey := ""
	if pubKey != nil {
		publicKey = pubKey.key
	}

	action := proxyHttpFetchAction{
		Url:       url,
		PublicKey: publicKey,
		Options:   *options,
	}
	actionJson, err := json.Marshal(action)
	if err != nil {
		process.Error([]byte(err.Error()))
	}

	actionJsonPtr, actionJsonLen := sedav1.GetDataPtr(actionJson)

	resultLength := sedav1.HttpFetch(actionJsonPtr, actionJsonLen)

	resultData := sedav1.GetResultData(resultLength)

	var promiseStatus promise.PromiseStatus
	err = json.Unmarshal(resultData, &promiseStatus)
	if err != nil {
		process.Error([]byte(err.Error()))
	}

	var httpFetchResponse HttpFetchResponse
	if promiseStatus.IsFulfilled() {
		err = json.Unmarshal(promiseStatus.GetFulfilled(), &httpFetchResponse)
		if err != nil {
			process.Error([]byte(err.Error()))
		}
	} else if promiseStatus.IsRejected() {
		err = json.Unmarshal(promiseStatus.GetRejected(), &httpFetchResponse)
		if err != nil {
			process.Error([]byte(err.Error()))
		}
	} else {
		process.Error([]byte("Promise not fulfilled or rejected"))
	}

	return httpFetchResponse
}

func GenerateProxyHttpSigningMessage(url string, method string, requestBody []byte, responseBody []byte) []byte {
	if requestBody == nil {
		requestBody = []byte{}
	}

	if responseBody == nil {
		responseBody = []byte{}
	}

	requestUrlHash := crypto.Keccak256([]byte(url))
	requestMethodHash := crypto.Keccak256([]byte(method))
	requestBodyHash := crypto.Keccak256(requestBody)
	responseBodyHash := crypto.Keccak256(responseBody)

	message := make([]byte, len(requestUrlHash)+len(requestMethodHash)+len(requestBodyHash)+len(responseBodyHash))
	copy(message, requestUrlHash)
	copy(message[len(requestUrlHash):], requestMethodHash)
	copy(message[len(requestUrlHash)+len(requestMethodHash):], requestBodyHash)
	copy(message[len(requestUrlHash)+len(requestMethodHash)+len(requestBodyHash):], responseBodyHash)

	return message
}
