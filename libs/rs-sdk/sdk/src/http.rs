use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};

use crate::errors::Result;
use crate::{
    bytes::{Bytes, FromBytes, ToBytes},
    promise::PromiseStatus,
};

#[derive(Serialize, Deserialize, Clone, Debug)]
struct HttpFetchAction {
    pub url: String,
    pub options: HttpFetchOptions,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct HttpFetchOptions {
    pub method: HttpFetchMethod,
    pub headers: BTreeMap<String, String>,
    pub body: Option<Bytes>,
}

impl Default for HttpFetchOptions {
    fn default() -> Self {
        HttpFetchOptions {
            method: HttpFetchMethod::Get,
            headers: BTreeMap::new(),
            body: None,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum HttpFetchMethod {
    Options,
    Get,
    Post,
    Put,
    Delete,
    Head,
    Trace,
    Connect,
    Patch,
}

impl HttpFetchMethod {
    pub fn as_str(&self) -> &str {
        match self {
            HttpFetchMethod::Options => "OPTIONS",
            HttpFetchMethod::Get => "GET",
            HttpFetchMethod::Post => "POST",
            HttpFetchMethod::Put => "PUT",
            HttpFetchMethod::Delete => "DELETE",
            HttpFetchMethod::Head => "HEAD",
            HttpFetchMethod::Trace => "TRACE",
            HttpFetchMethod::Connect => "CONNECT",
            HttpFetchMethod::Patch => "PATCH",
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct HttpFetchResponse {
    /// HTTP Status code
    pub status: u16,

    /// Response headers
    pub headers: BTreeMap<String, String>,

    /// Response body in bytes
    pub bytes: Vec<u8>,

    /// The final URL that was resolved
    pub url: String,

    /// The byte length of the response
    pub content_length: usize,
}

impl HttpFetchResponse {
    pub fn is_ok(&self) -> bool {
        self.status >= 200 && self.status <= 299
    }

    pub fn from_promise(promise_status: PromiseStatus) -> Self {
        match promise_status {
            PromiseStatus::Rejected(error) => HttpFetchResponse {
                content_length: error.len(),
                bytes: error,
                headers: BTreeMap::default(),
                status: 0,
                url: String::default(),
            },
            _ => promise_status.parse().unwrap(),
        }
    }
}

impl ToBytes for HttpFetchResponse {
    fn to_bytes(self) -> Bytes {
        serde_json::to_vec(&self).unwrap().to_bytes()
    }
}

impl FromBytes for HttpFetchResponse {
    fn from_bytes(bytes: &[u8]) -> Result<Self> {
        serde_json::from_slice(bytes).map_err(Into::into)
    }

    fn from_bytes_vec(bytes: Vec<u8>) -> Result<Self> {
        serde_json::from_slice(&bytes).map_err(Into::into)
    }
}

impl TryFrom<Vec<u8>> for HttpFetchResponse {
    type Error = serde_json::Error;

    fn try_from(value: Vec<u8>) -> Result<Self, Self::Error> {
        serde_json::from_slice(&value)
    }
}

/// Performs an HTTP fetch request with the given URL and options.
///
/// # Arguments
///
/// * `url` - The URL to fetch, can be any type that implements `ToString`
/// * `options` - Optional `HttpFetchOptions` to configure the request
///
/// # Examples
///
/// ```no_run
/// use seda_sdk::http::{http_fetch, HttpFetchOptions, HttpFetchMethod};
/// use std::collections::BTreeMap;
///
/// // Basic GET request
/// let response = http_fetch("https://api.example.com/data", None);
/// if response.is_ok() {
///     println!("Status: {}", response.status);
///     println!("Body length: {}", response.content_length);
/// }
///
/// // POST request with JSON payload
/// let mut headers = BTreeMap::new();
/// headers.insert("Content-Type".to_string(), "application/json".to_string());
///
/// let options = HttpFetchOptions {
///     method: HttpFetchMethod::Post,
///     headers,
///     body: Some(b"{\"temperature\": 25.5, \"unit\": \"celsius\"}".to_vec()),
/// };
///
/// let response = http_fetch("https://weather-api.example.com/update", Some(options));
///
/// // Handle the response
/// if response.is_ok() {
///     // Access response data
///     println!("Status code: {}", response.status);
///     println!("Final URL: {}", response.url);
///     println!("Response size: {}", response.content_length);
///     
///     // Process response headers
///     if let Some(content_type) = response.headers.get("content-type") {
///         println!("Content-Type: {}", content_type);
///     }
///     
///     // Process response body
///     if !response.bytes.is_empty() {
///         // Convert bytes to string if it's UTF-8 encoded
///         if let Ok(body_text) = String::from_utf8(response.bytes.clone()) {
///             println!("Response body: {}", body_text);
///         }
///     }
/// } else {
///     println!("Request failed with status: {}", response.status);
/// }
/// ```

pub fn http_fetch<URL: ToString>(url: URL, options: Option<HttpFetchOptions>) -> HttpFetchResponse {
    let http_action = HttpFetchAction {
        url: url.to_string(),
        options: options.unwrap_or_default(),
    };

    let action = serde_json::to_string(&http_action).unwrap();
    let result_length = unsafe { super::raw::http_fetch(action.as_ptr(), action.len() as u32) };
    let mut result_data_ptr = vec![0; result_length as usize];

    unsafe {
        super::raw::call_result_write(result_data_ptr.as_mut_ptr(), result_length);
    }

    let promise_status: PromiseStatus =
        serde_json::from_slice(&result_data_ptr).expect("Could not deserialize http_fetch");

    HttpFetchResponse::from_promise(promise_status)
}
