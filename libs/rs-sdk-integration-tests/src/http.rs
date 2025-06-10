use std::collections::BTreeMap;

use seda_sdk_rs::{bytes::ToBytes, http::http_fetch, process::Process, HttpFetchMethod, HttpFetchOptions};
use serde::{Deserialize, Serialize};

pub fn test_http_rejection() {
    let response = http_fetch("https://example.com/", None);

    if !response.is_ok() {
        Process::success(&"rejected".to_bytes());
        return;
    }

    Process::error(&"test failed".to_bytes());
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TodoResponse {
    user_id: i64,
    id: i64,
    title: String,
    completed: bool,
}

pub fn test_http_success() {
    let response = http_fetch("https://jsonplaceholder.typicode.com/todos/1", None);

    if response.is_ok() {
        let data = serde_json::from_slice::<TodoResponse>(&response.bytes).unwrap();
        Process::success(&format!("{}:{}:{}:{}", data.user_id, data.id, data.title, data.completed).to_bytes());
        return;
    }

    Process::error(&response.bytes);
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct PostResponse {
    id: i64,
    title: String,
    body: String,
}

pub fn test_http_post_success() {
    let mut headers = BTreeMap::new();
    headers.insert("Content-Type".to_string(), "application/json".to_string());

    let options = HttpFetchOptions {
        method: HttpFetchMethod::Post,
        headers,
        body: Some("{\"title\":\"Test SDK\",\"body\":\"Don't forget to test some integrations.\"}".to_bytes()),
        timeout_ms: None,
    };

    let response = http_fetch("https://jsonplaceholder.typicode.com/posts", Some(options));

    if response.is_ok() {
        let data = serde_json::from_slice::<PostResponse>(&response.bytes).unwrap();
        Process::success(&format!("{}:{}:{}", data.id, data.title, data.body).to_bytes());
        return;
    }

    Process::error(&response.bytes);
}

pub fn test_user_http_should_timeout() {
    let mut headers = BTreeMap::new();
    headers.insert("Content-Type".to_string(), "application/json".to_string());

    let options = HttpFetchOptions {
        method: HttpFetchMethod::Get,
        headers,
        body: None,
        timeout_ms: Some(1000),
    };

    let response = http_fetch("https://fakeresponder.onrender.com/?sleepMs=5000", Some(options));
    if response.is_ok() {
        Process::success(&"success".to_bytes());
        return;
    }

    Process::error(&response.bytes);
}

pub fn test_user_http_no_timeout() {
    let mut headers = BTreeMap::new();
    headers.insert("Content-Type".to_string(), "application/json".to_string());

    let options = HttpFetchOptions {
        method: HttpFetchMethod::Get,
        headers,
        body: None,
        timeout_ms: Some(5000),
    };

    let response = http_fetch("https://fakeresponder.onrender.com/?sleepMs=1000", Some(options));
    if response.is_ok() {
        Process::success(&"success".to_bytes());
        return;
    }

    Process::error(&response.bytes);
}

pub fn test_long_fetch() {
    let mut headers = BTreeMap::new();
    headers.insert("Content-Type".to_string(), "application/json".to_string());

    let options = HttpFetchOptions {
        method: HttpFetchMethod::Get,
        headers,
        body: None,
        timeout_ms: Some(20000),
    };

    let response = http_fetch("https://fakeresponder.onrender.com/?sleepMs=10000", Some(options));
    if response.is_ok() {
        Process::success(&"success".to_bytes());
        return;
    }

    Process::error(&response.bytes);
}
