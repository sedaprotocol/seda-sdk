package tests

import (
	"encoding/json"
	"fmt"

	"github.com/seda-protocol/seda-sdk/http"
	"github.com/seda-protocol/seda-sdk/process"
)

func TestHttpRejection() {
	response := http.HttpFetch("https://example.com/", nil)

	if !response.IsOk() {
		process.Success([]byte("rejected"))
	}

	process.Error([]byte("test failed"))
}

type TodoResponse struct {
	UserId    int    `json:"userId"`
	Id        int    `json:"id"`
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
}

func TestHttpSuccess() {
	response := http.HttpFetch("https://jsonplaceholder.typicode.com/todos/1", nil)

	if response.IsOk() {
		var todoResponse TodoResponse
		err := json.Unmarshal(response.Bytes, &todoResponse)
		if err != nil {
			process.Error([]byte(err.Error()))
		}

		process.Success([]byte(fmt.Sprintf("%d:%d:%s:%t", todoResponse.UserId, todoResponse.Id, todoResponse.Title, todoResponse.Completed)))
	}

	process.Error(response.Bytes)
}

type PostResponse struct {
	Id    int    `json:"id"`
	Title string `json:"title"`
	Body  string `json:"body"`
}

func TestPostHttpSuccess() {
	response := http.HttpFetch("https://jsonplaceholder.typicode.com/posts", &http.HttpFetchOptions{
		Method: "POST",
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: []byte(`{"title":"Test SDK","body":"Don't forget to test some integrations."}`),
	})

	if response.IsOk() {
		var postResponse PostResponse
		err := json.Unmarshal(response.Bytes, &postResponse)
		if err != nil {
			process.Error([]byte(err.Error()))
		}

		process.Success([]byte(fmt.Sprintf("%d:%s:%s", postResponse.Id, postResponse.Title, postResponse.Body)))
	}

	process.Error(response.Bytes)
}
