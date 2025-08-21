//! HTTP fetch action and associated types for the `seda_runtime_sdk`.
//!
//! Defines JSON-serializable request and response structs ([`HttpFetchAction`], [`HttpFetchOptions`], [`HttpFetchResponse`])
//! and provides [`http_fetch`] for executing HTTP requests via VM FFI calls.

use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};

use crate::errors::{Result, SDKError};
use crate::generate_proxy_http_signing_message;
use crate::secp256k1_verify;
use crate::{
    bytes::{Bytes, FromBytes, ToBytes},
    promise::PromiseStatus,
};

/// An HTTP fetch action containing the target URL and fetch options.
/// This action is serialized and sent to the VM for execution.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct HttpFetchAction {
    /// The URL to fetch.
    pub url: String,
    /// The options for the HTTP fetch request.
    pub options: HttpFetchOptions,
}

/// Options for the HTTP fetch request, including method, headers, body, and timeout.
/// This struct is serialized and sent to the VM for execution.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct HttpFetchOptions {
    /// The HTTP method to use for the request.
    pub method: HttpFetchMethod,
    /// Headers to include in the request.
    pub headers: BTreeMap<String, String>,
    /// The body of the request, if any.
    pub body: Option<Bytes>,
    /// Timeout for the request in milliseconds.
    pub timeout_ms: Option<u32>,
}

impl Default for HttpFetchOptions {
    fn default() -> Self {
        HttpFetchOptions {
            method: HttpFetchMethod::Get,
            headers: BTreeMap::new(),
            body: None,
            timeout_ms: Some(2_000),
        }
    }
}

/// Represents the HTTP methods that can be used in an HTTP fetch request.
/// This enum is serialized and sent to the VM for execution.
/// It represents the various [HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
/// that can be used in an HTTP fetch request.
#[derive(Serialize, Deserialize, Clone, Debug)]
#[allow(missing_docs)]
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
    /// Returns the string representation, in all caps, of the HTTP method.
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

/// Represents the response from an HTTP fetch request.
/// This struct is serialized and the result is returned to the caller.
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
    /// Returns `true` if the status code is in the 2xx range.
    ///
    /// # Examples
    ///
    /// ```
    /// use seda_sdk_rs::http::HttpFetchResponse;
    /// let response = HttpFetchResponse {
    ///     status: 200,
    ///     headers: Default::default(),
    ///     bytes: Vec::new(),
    ///     url: "https://api.example.com/data".to_string(),
    ///     content_length: 0,
    /// };
    /// assert!(response.is_ok());
    /// ```
    pub fn is_ok(&self) -> bool {
        self.status >= 200 && self.status <= 299
    }

    /// Converts a [`PromiseStatus`] into an [`HttpFetchResponse`], treating rejections as errors.
    ///
    /// # Errors
    ///
    /// Fails if the `PromiseStatus` is not a `Fulfilled` variant or if the deserialization fails.
    pub fn from_promise(promise_status: PromiseStatus) -> Self {
        match promise_status {
            PromiseStatus::Rejected(error) => error.try_into().unwrap(),
            _ => promise_status.parse().unwrap(),
        }
    }

    /// Returns true if the proxy verification is successful.
    /// This is only meant to be called on the response to a proxy request and not a normal HTTP request.
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use std::collections::BTreeMap;
    /// use seda_sdk_rs::http::{HttpFetchResponse, HttpFetchMethod};
    /// let response = HttpFetchResponse {
    ///     status: 200,
    ///     headers: BTreeMap::from([("x-seda-signature", "signature"), ("x-seda-publickey", "publickey")]),
    ///     bytes: Vec::new(),
    ///     url: "https://api.example.com/data".to_string(),
    ///     content_length: 10,
    /// };
    /// response.proxy_verification(HttpFetchMethod::Get, None);
    /// ```
    ///
    /// # Errors
    ///
    /// Fails if the `x-seda-signature` or `x-seda-publickey` headers are missing or invalid.
    pub fn proxy_verification(
        &self,
        http_method: HttpFetchMethod,
        request_body: Option<Vec<u8>>,
    ) -> anyhow::Result<bool> {
        let signature_hex = self
            .headers
            .get("x-seda-signature")
            .ok_or(SDKError::MissingSignatureHeader)?;
        let public_key_hex = self
            .headers
            .get("x-seda-publickey")
            .ok_or(SDKError::MissingPublicKeyHeader)?;

        let signature: [u8; 64] =
            const_hex::const_decode_to_array(signature_hex.as_bytes()).map_err(|_| SDKError::InvalidSignatureHeader)?;
        let public_key: [u8; 33] = const_hex::const_decode_to_array(public_key_hex.as_bytes())
            .map_err(|_| SDKError::InvalidPublicKeyHeader)?;

        let message = generate_proxy_http_signing_message(
            self.url.clone(),
            http_method,
            request_body.unwrap_or_default().to_bytes(),
            self.bytes.clone().to_bytes(),
        )
        .eject();

        Ok(secp256k1_verify(&message, &signature, &public_key))
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
/// This wraps the unsafe FFI call to the VM's `http_fetch` function.
///
/// # Panics
///
/// Panics if the serialization of the [`HttpFetchAction`] fails or if the deserialization of the response fails.
/// We expect these to never happen in practice, as the SDK is designed to ensure valid inputs.
///
/// # Examples
///
/// ```no_run
/// use seda_sdk_rs::{bytes::ToBytes, http::{http_fetch, HttpFetchMethod, HttpFetchOptions}};
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
///     body: Some(serde_json::to_vec(&serde_json::json!({"temperature": 25.5, "unit": "celsius"})).unwrap().to_bytes()),
///     timeout_ms: Some(5_000),
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
