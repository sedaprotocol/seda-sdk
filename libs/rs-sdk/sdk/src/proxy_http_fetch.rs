use serde::{Deserialize, Serialize};

use crate::{
    http::{HttpFetchOptions, HttpFetchResponse},
    promise::PromiseStatus,
};

#[derive(Serialize, Deserialize, Clone, Debug)]
struct ProxyHttpFetchAction {
    pub url: String,
    pub public_key: Option<String>,
    pub options: HttpFetchOptions,
}

/// Makes an HTTP request through the proxy service
///
/// # Examples
///
/// ```no_run
/// use seda_sdk::proxy_http_fetch::proxy_http_fetch;
/// use seda_sdk::http::{HttpFetchOptions, HttpFetchMethod};
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
///     body: Some(b"{\"key\": \"value\"}".to_vec()),
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
    let result_length =
        unsafe { super::raw::proxy_http_fetch(action.as_ptr(), action.len() as u32) };
    let mut result_data_ptr = vec![0; result_length as usize];

    unsafe {
        super::raw::call_result_write(result_data_ptr.as_mut_ptr(), result_length);
    }

    let promise_status: PromiseStatus =
        serde_json::from_slice(&result_data_ptr).expect("Could not deserialize proxy_http_fetch");

    HttpFetchResponse::from_promise(promise_status)
}
