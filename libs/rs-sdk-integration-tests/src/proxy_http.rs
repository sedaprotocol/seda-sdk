use seda_sdk_rs::{
    bytes::{Bytes, ToBytes},
    http::HttpFetchMethod,
    process::Process,
    proxy_http_fetch::{generate_proxy_http_signing_message, proxy_http_fetch},
};

pub fn test_proxy_http_fetch() {
    let response = proxy_http_fetch("http://localhost:5384/proxy/planets/1", None, None);

    if response.is_ok() {
        Process::success(&response.bytes);
        return;
    }

    Process::error(&response.bytes);
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
