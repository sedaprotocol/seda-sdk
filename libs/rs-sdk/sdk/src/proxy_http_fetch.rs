//! Proxy HTTP fetch action and associated types for the `seda_runtime_sdk`.
//! These are used to make HTTP requests through the proxy nodes.
//!
//! Defines JSON-serializable request and the struct [`ProxyHttpFetchAction`]
//! and provides, [`proxy_http_fetch`], [`generate_proxy_http_signing_message`]
//! for executing proxy HTTP requests, and generating signing messages via VM FFI calls.

use serde::{Deserialize, Serialize};

use crate::{
    bytes::{Bytes, ToBytes},
    http::{HttpFetchOptions, HttpFetchResponse},
    keccak256::keccak256,
    promise::PromiseStatus,
    HttpFetchMethod,
};

/// An Proxy HTTP fetch action containing the target URL, fetch options, and public key of the proxy.
/// This action is serialized and sent to the VM for execution.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ProxyHttpFetchAction {
    /// The URL to fetch.
    pub url: String,
    /// The public key of the proxy node that will handle the request.
    pub public_key: Option<String>,
    /// The options for the HTTP fetch request.
    pub options: HttpFetchOptions,
}

/// Makes an HTTP request through the proxy service
///
/// # Panics
///
/// Panics if the serialization of the [`ProxyHttpFetchAction`] fails or if the deserialization of the response fails.
/// We expect these to never happen in practice, as the SDK is designed to ensure valid inputs.
///
/// # Examples
///
/// ```no_run
/// use seda_sdk_rs::bytes::ToBytes;
/// use seda_sdk_rs::proxy_http_fetch::proxy_http_fetch;
/// use seda_sdk_rs::http::{HttpFetchOptions, HttpFetchMethod};
/// use std::collections::BTreeMap;
///
/// // Basic GET request
/// let response = proxy_http_fetch("https://api.example.com/data", None, None);
/// if response.is_ok() {
///     println!("Status: {}", response.status);
///     println!("Body length: {}", response.content_length);
/// }
///
/// // POST request with custom options
/// let mut headers = BTreeMap::new();
/// headers.insert("Content-Type".to_string(), "application/json".to_string());
///
/// let options = HttpFetchOptions {
///     method: HttpFetchMethod::Post,
///     headers,
///     body: Some(serde_json::to_vec(&serde_json::json!({"key": "value"})).unwrap().to_bytes()),
///     timeout_ms: None,
/// };
///
/// let response = proxy_http_fetch(
///     "https://api.example.com/data",
///     Some("02452f1c0a2753c6d2e55da4abeb1b6115c595eec9b0e237b8aaa74913ad3f1dc7".to_string()),
///     Some(options)
/// );
///
/// // Check response
/// if response.is_ok() {
///     // Access response data
///     println!("Status: {}", response.status);
///     println!("Final URL: {}", response.url);
///     println!("Response size: {}", response.content_length);
///
///     // Access response headers
///     if let Some(content_type) = response.headers.get("content-type") {
///         println!("Content-Type: {}", content_type);
///     }
/// }
/// ```
pub fn proxy_http_fetch<URL: ToString>(
    url: URL,
    public_key: Option<String>,
    options: Option<HttpFetchOptions>,
) -> HttpFetchResponse {
    let http_action = ProxyHttpFetchAction {
        url: url.to_string(),
        public_key,
        options: options.unwrap_or_default(),
    };

    let action = serde_json::to_string(&http_action).unwrap();
    let result_length = unsafe { super::raw::proxy_http_fetch(action.as_ptr(), action.len() as u32) };
    let mut result_data_ptr = vec![0; result_length as usize];

    unsafe {
        super::raw::call_result_write(result_data_ptr.as_mut_ptr(), result_length);
    }

    let promise_status: PromiseStatus =
        serde_json::from_slice(&result_data_ptr).expect("Could not deserialize proxy_http_fetch");

    HttpFetchResponse::from_promise(promise_status)
}

/// Generates the message which the data proxy hashed and signed. This can be useful when you need to verify
/// the data proxy signature in the tally phase. With this message there is no need to include the entire request
/// and response data in the execution result.
///
///
/// # Examples
///
/// ```no_run
/// use seda_sdk_rs::{
///     bytes::{Bytes, ToBytes},
///     http::HttpFetchMethod,
///     proxy_http_fetch::{generate_proxy_http_signing_message, proxy_http_fetch},
/// };
///
/// let url = "https://api.example.com/data";
/// let response = proxy_http_fetch(url, None, None);
///
/// if response.is_ok() {
///     let proxy_message = generate_proxy_http_signing_message(
///         url.to_string(),
///         HttpFetchMethod::Get,
///         Bytes::default(),
///         response.bytes.to_bytes()
///     );
///     // Use proxy_message for signature verification
/// }
/// ```
pub fn generate_proxy_http_signing_message(
    url: String,
    method: HttpFetchMethod,
    request_body: Bytes,
    response_body: Bytes,
) -> Bytes {
    let url_hash = keccak256(url.as_bytes().to_vec());
    let method_hash = keccak256(method.as_str().as_bytes().to_vec());
    let request_body_hash = keccak256(request_body.to_vec());
    let response_body_hash = keccak256(response_body.to_vec());

    [url_hash, method_hash, request_body_hash, response_body_hash]
        .concat()
        .to_bytes()
}
