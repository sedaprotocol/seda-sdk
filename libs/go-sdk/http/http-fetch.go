package http

import (
	"encoding/json"
	"fmt"

	process "github.com/seda-protocol/seda-sdk/process"
	"github.com/seda-protocol/seda-sdk/promise"
	sedav1 "github.com/seda-protocol/seda-sdk/seda_v1"
)

type httpFetchAction struct {
	Url     string           `json:"url"`
	Options HttpFetchOptions `json:"options"`
}

func HttpFetch(url string, options *HttpFetchOptions) HttpFetchResponse {
	if options == nil {
		options = &HttpFetchOptions{
			Method: "GET",
		}
	}

	if !IsValidHttpMethod(options.Method) {
		process.Error([]byte(fmt.Sprintf("invalid http method: %s", options.Method)))
	}

	action := httpFetchAction{
		Url:     url,
		Options: *options,
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
