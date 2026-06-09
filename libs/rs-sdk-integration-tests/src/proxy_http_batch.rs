use std::collections::BTreeMap;

use seda_sdk_rs::{
    bytes::ToBytes,
    http::{HttpFetchMethod, HttpFetchOptions},
    process::Process,
    proxy_http_fetch::proxy_http_fetch_batch,
};

pub fn test_proxy_http_fetch_batch_success() {
    let requests = vec![
        ("https://proxy1.example.com/data", None, None),
        ("https://proxy2.example.com/data", None, None),
    ];

    let responses = proxy_http_fetch_batch(requests);

    if responses.len() != 2 {
        Process::error(&format!("expected 2 responses, got {}", responses.len()).to_bytes());
    }

    let all_ok = responses.iter().all(|r| r.is_ok());
    if !all_ok {
        Process::error(&"not all responses were successful".to_bytes());
    }

    Process::success(&format!("{}:{}", responses[0].status, responses[1].status).to_bytes());
}

pub fn test_proxy_http_fetch_batch_partial_failure() {
    let requests = vec![
        ("https://proxy1.example.com/data", None, None),
        ("https://proxy2.example.com/error", None, None),
    ];

    let responses = proxy_http_fetch_batch(requests);

    if responses.len() != 2 {
        Process::error(&format!("expected 2 responses, got {}", responses.len()).to_bytes());
    }

    let first_ok = responses[0].is_ok();
    let second_ok = responses[1].is_ok();

    Process::success(&format!("{}:{}", first_ok, second_ok).to_bytes());
}

pub fn test_proxy_http_fetch_batch_options() {
    let mut headers = BTreeMap::new();
    headers.insert("Content-Type".to_string(), "application/json".to_string());
    headers.insert("X-Proxy-Custom".to_string(), "batch-proxy-test".to_string());

    let requests = vec![
        (
            "https://proxy.example.com/get",
            None,
            Some(HttpFetchOptions {
                method: HttpFetchMethod::Get,
                headers: BTreeMap::new(),
                body: None,
                timeout_ms: Some(5000),
            }),
        ),
        (
            "https://proxy.example.com/post",
            None,
            Some(HttpFetchOptions {
                method: HttpFetchMethod::Post,
                headers,
                body: Some(r#"{"proxy":"data"}"#.to_bytes()),
                timeout_ms: Some(3000),
            }),
        ),
    ];

    let responses = proxy_http_fetch_batch(requests);

    if responses.len() != 2 {
        Process::error(&format!("expected 2 responses, got {}", responses.len()).to_bytes());
    }

    let first_body = String::from_utf8(responses[0].bytes.clone()).unwrap_or_default();
    let second_body = String::from_utf8(responses[1].bytes.clone()).unwrap_or_default();

    Process::success(&format!("{}|{}", first_body, second_body).to_bytes());
}
