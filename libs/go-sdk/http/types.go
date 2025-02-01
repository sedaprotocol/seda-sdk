package http

import "github.com/seda-protocol/seda-sdk/seda_v1"

var (
	httpMethods = []string{"GET", "POST", "PUT", "DELETE", "HEAD", "TRACE", "CONNECT", "PATCH"}
)

func IsValidHttpMethod(method string) bool {
	for _, m := range httpMethods {
		if m == method {
			return true
		}
	}
	return false
}

type HttpFetchOptions struct {
	Method  string            `json:"method"`
	Headers map[string]string `json:"headers,omitempty"`
	Body    seda_v1.ByteArray `json:"body,omitempty"`
}

type HttpFetchResponse struct {
	Status        uint16            `json:"status"`
	Headers       map[string]string `json:"headers"`
	Bytes         []byte            `json:"bytes"`
	Url           string            `json:"url"`
	ContentLength uint              `json:"content_length"`
}

func (r HttpFetchResponse) IsOk() bool {
	return r.Status >= 200 && r.Status <= 299
}
