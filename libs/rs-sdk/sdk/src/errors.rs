//! Error definitions and result type for the `seda_runtime_sdk`.
//!
//! This module provides the [`SDKError`] enum representing all possible errors
//! within the SDK, and a convenient [`Result`] alias for SDK operations.

use thiserror::Error;

/// Represents errors that can occur when using the `seda_runtime_sdk`.
#[derive(Debug, Error)]
pub enum SDKError {
    /// Wraps errors from JSON serialization or deserialization.
    #[error(transparent)]
    Serde(#[from] serde_json::Error),

    /// Wraps errors arising from converting bytes into a UTF-8 `String`.
    #[error(transparent)]
    FromUtf8Error(#[from] std::string::FromUtf8Error),

    /// Errors encountered when interpreting raw bytes as UTF-8.
    #[error("{0:?}")]
    StringBytesConversion(#[from] std::str::Utf8Error),

    /// Wraps errors when converting a byte slice into a fixed-size array.
    #[error(transparent)]
    NumBytesConversion(#[from] std::array::TryFromSliceError),

    /// Indicates that a value did not meet expected constraints.
    #[error("Invalid value")]
    InvalidValue,
}

/// A specialized `Result` type for SDK operations that return `SDKError`.
pub type Result<T, E = SDKError> = core::result::Result<T, E>;
