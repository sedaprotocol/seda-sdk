//! This module defines the `PromiseStatus` enum, which represents the status of a promise
//! in the Seda runtime SDK. It can either be fulfilled with a result or rejected with an
//! error message. The enum provides methods to handle the promise status and convert it from
//! a [`core::result::Result`] type.

use std::fmt::Debug;

use serde::{Deserialize, Serialize};

use crate::bytes::ToBytes;

/// Represents the status of a promise, which can either be fulfilled or rejected.
/// This enum is returned by the host VM after executing a promise action.
// TODO: Fulfilled and Rejected could now just be our Bytes type.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum PromiseStatus {
    /// The promise completed successfully contains the bytes of the result if any.
    Fulfilled(Option<Vec<u8>>),

    /// There was an error executing this promise.
    /// The error is represented as bytes, which can be a string or any other serialized form.
    // TODO: Is there ever a case where Rejected isn't a string?
    // HTTP rejections could be an object(but encoded in a string).
    // Could private the type and then have methods or something.
    Rejected(Vec<u8>),
}

impl PromiseStatus {
    /// Helper function that immediately assumes that the promise has been
    /// fulfilled and returns the value.
    ///
    /// # Panics
    ///
    /// Panics if the promise is not fulfilled.
    ///
    /// # Examples
    ///
    /// ```
    /// use seda_sdk_rs::{promise::PromiseStatus, bytes::ToBytes};
    /// let promise = PromiseStatus::Fulfilled(Some("Hello, world!".to_bytes().eject()));
    /// assert_eq!(promise.fulfilled(), b"Hello, world!");
    /// ```
    pub fn fulfilled(self) -> Vec<u8> {
        if let Self::Fulfilled(Some(value)) = self {
            return value;
        }

        panic!("Promise is not fulfilled: {:?}", &self);
    }

    /// Parses the fulfilled value of the promise into the desired type.
    ///
    /// # Panics
    ///
    /// Panics if the promise is not fulfilled.
    ///
    /// # Errors
    ///
    /// Returns an error if the conversion from bytes to the desired type fails.
    ///
    /// # Examples
    ///
    /// ```
    /// use seda_sdk_rs::{promise::PromiseStatus, bytes::ToBytes};
    /// use serde_json::Value;
    ///
    /// let value = serde_json::json!({"key": "value"});
    /// let promise = PromiseStatus::Fulfilled(Some(serde_json::to_vec(&value).unwrap()));
    ///
    /// let parsed: Value = promise.parse().unwrap();
    /// assert_eq!(parsed, value);
    /// ```
    pub fn parse<T>(self) -> Result<T, serde_json::Error>
    where
        T: serde::de::DeserializeOwned,
    {
        let value = self.fulfilled();

        serde_json::from_slice(&value)
    }
}

impl<T: ToBytes, E: std::error::Error> From<Result<T, E>> for PromiseStatus {
    fn from(value: Result<T, E>) -> Self {
        match value {
            Ok(fulfilled) => PromiseStatus::Fulfilled(Some(fulfilled.to_bytes().eject())),
            Err(rejection) => PromiseStatus::Rejected(rejection.to_string().to_bytes().eject()),
        }
    }
}

impl<T: ToBytes, E: std::error::Error> From<Result<Option<T>, E>> for PromiseStatus {
    fn from(value: Result<Option<T>, E>) -> Self {
        match value {
            Ok(fulfilled) => PromiseStatus::Fulfilled(fulfilled.map(|inner| inner.to_bytes().eject())),
            Err(rejection) => PromiseStatus::Rejected(rejection.to_string().to_bytes().eject()),
        }
    }
}
