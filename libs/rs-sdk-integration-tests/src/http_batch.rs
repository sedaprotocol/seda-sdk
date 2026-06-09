use std::collections::BTreeMap;

use seda_sdk_rs::{
    bytes::ToBytes,
    http::{http_fetch_batch, HttpFetchMethod, HttpFetchOptions},
    process::Process,
};

pub fn test_http_fetch_batch_success() {
    let requests = vec![
        ("https://jsonplaceholder.typicode.com/todos/1", None),
        ("https://jsonplaceholder.typicode.com/todos/2", None),
    ];

    let responses = http_fetch_batch(requests);

    if responses.len() != 2 {
        Process::error(&format!("expected 2 responses, got {}", responses.len()).to_bytes());
    }

    let all_ok = responses.iter().all(|r| r.is_ok());
    if !all_ok {
        Process::error(&"not all responses were successful".to_bytes());
    }

    Process::success(&format!("{}:{}", responses[0].status, responses[1].status).to_bytes());
}

pub fn test_http_fetch_batch_partial_failure() {
    let requests = vec![
        ("https://jsonplaceholder.typicode.com/todos/1", None),
        ("https://invalid-domain-that-does-not-exist.example/foo", None),
    ];

    let responses = http_fetch_batch(requests);

    if responses.len() != 2 {
        Process::error(&format!("expected 2 responses, got {}", responses.len()).to_bytes());
    }

    let first_ok = responses[0].is_ok();
    let second_ok = responses[1].is_ok();

    Process::success(&format!("{}:{}", first_ok, second_ok).to_bytes());
}

pub fn test_http_fetch_batch_options() {
    let mut headers = BTreeMap::new();
    headers.insert("Content-Type".to_string(), "application/json".to_string());
    headers.insert("X-Custom".to_string(), "batch-test".to_string());

    let requests = vec![
        (
            "https://api.example.com/get",
            Some(HttpFetchOptions {
                method: HttpFetchMethod::Get,
                headers: BTreeMap::new(),
                body: None,
                timeout_ms: Some(5000),
            }),
        ),
        (
            "https://api.example.com/post",
            Some(HttpFetchOptions {
                method: HttpFetchMethod::Post,
                headers,
                body: Some(r#"{"key":"value"}"#.to_bytes()),
                timeout_ms: Some(3000),
            }),
        ),
    ];

    let responses = http_fetch_batch(requests);

    if responses.len() != 2 {
        Process::error(&format!("expected 2 responses, got {}", responses.len()).to_bytes());
    }

    let first_body = String::from_utf8(responses[0].bytes.clone()).unwrap_or_default();
    let second_body = String::from_utf8(responses[1].bytes.clone()).unwrap_or_default();

    Process::success(&format!("{}|{}", first_body, second_body).to_bytes());
}
