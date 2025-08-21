use seda_sdk_rs::{
    bytes::{Bytes, ToBytes},
    http::HttpFetchMethod,
    process::Process,
    proxy_http_fetch::{generate_proxy_http_signing_message, proxy_http_fetch},
    HttpFetchResponse,
};

pub fn test_proxy_http_fetch() {
    let response = proxy_http_fetch("http://localhost:5384/proxy/planets/1", None, None);

    if response.is_ok() {
        Process::success(&response.bytes);
        return;
    }

    Process::error(&"rejected".to_bytes());
}

pub fn test_generate_proxy_http_message() {
    let response_body = "{\"name\":\"data-proxy\"}".as_bytes().to_vec();

    let message = generate_proxy_http_signing_message(
        "https://example.com".to_string(),
        HttpFetchMethod::Get,
        Bytes::default(),
        response_body.to_bytes(),
    );

    Process::success(hex::encode(message.to_vec()).as_bytes());
}

#[derive(serde::Deserialize)]
struct VerificationTest {
    response: HttpFetchResponse,
    method: HttpFetchMethod,
    request_body: Option<Vec<u8>>,
}

pub fn test_proxy_http_fetch_verification() {
    if !Process::is_tally_vm_mode() {
        Process::error(&"not in tally vm mode".to_bytes());
    }

    let reveals = seda_sdk_rs::get_unfiltered_reveals().unwrap();

    if reveals.len() != 1 {
        Process::error(&"not exactly one reveal".to_bytes());
        return;
    }

    let test_case: VerificationTest = serde_json::from_slice(&reveals[0].body.reveal).expect("Valid test case");

    let verified = test_case
        .response
        .proxy_verification(test_case.method, test_case.request_body)
        .expect("Proxy verification to not fail");

    if !verified {
        Process::error(&"verification failed".to_bytes());
        return;
    }

    Process::success(&"verification succeeded".to_bytes());
}
