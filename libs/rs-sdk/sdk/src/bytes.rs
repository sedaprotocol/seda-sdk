//! Module for handling byte arrays in a oracle program compatible way.
//!
//! Creating a standardized way to handle byte arrays is important for
//! oracle programs, as they are expected to return promises in a specific
//! format.
//!
//! This module provides a [`Bytes`] type that wraps a vector of bytes
//! and implements the [`ToBytes`] and [`FromBytes`] traits for various types.

use std::ops::Deref;

use serde::{Deserialize, Serialize};

use crate::{errors, errors::Result};

/// A wrapper around a vector of bytes that provides convenience methods for
/// the format that oracle promises are expected to be in.
#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct Bytes(Vec<u8>);

impl Bytes {
    /// Get the inner vector of bytes.
    ///
    /// # Examples
    ///
    /// ```
    /// use seda_sdk_rs::bytes::{Bytes, ToBytes};
    /// let bytes: Bytes = "Hello, world!".to_bytes();
    /// let inner: Vec<u8> = bytes.eject();
    /// assert_eq!(inner, b"Hello, world!");
    /// ```
    pub fn eject(self) -> Vec<u8> {
        self.0
    }
}

impl Deref for Bytes {
    type Target = [u8];

    fn deref(&self) -> &Self::Target {
        self.0.as_slice()
    }
}

/// A trait for types that can be converted to the [`Bytes`] type.
///
/// This trait is implemented for various types such as `Vec<u8>`, `String`, `&str`, and primitive types like `u8`, `i32`, etc.
///
/// Additionally it supports an JSON serializable type via the [`serde`] and [`serde_json`] crates.
pub trait ToBytes {
    /// Converts the implementing type to a [`Bytes`] instance.
    ///
    /// # Examples
    ///
    /// ```
    /// use seda_sdk_rs::bytes::{Bytes, ToBytes};
    /// let bytes: Bytes = "Hello, world!".to_bytes();
    /// assert_eq!(bytes.eject(), b"Hello, world!");
    /// ```
    fn to_bytes(self) -> Bytes;
}

impl ToBytes for Bytes {
    fn to_bytes(self) -> Bytes {
        self
    }
}

impl ToBytes for Vec<u8> {
    fn to_bytes(self) -> Bytes {
        Bytes(self)
    }
}

impl ToBytes for String {
    fn to_bytes(self) -> Bytes {
        Bytes(self.as_bytes().to_vec())
    }
}

impl ToBytes for &str {
    fn to_bytes(self) -> Bytes {
        Bytes(self.as_bytes().to_vec())
    }
}

impl ToBytes for bool {
    fn to_bytes(self) -> Bytes {
        Bytes(vec![self as u8])
    }
}

impl ToBytes for () {
    fn to_bytes(self) -> Bytes {
        Bytes::default()
    }
}

/// A trait to convert [`Bytes`] into a specific type.
///
/// This trait is implemented for various types such as `Vec<u8>`, `String`, `&str`, and primitive types like `u8`, `i32`, etc.
///
/// Additionally it supports an JSON deserializable type via the [`serde`] and [`serde_json`] crates.
pub trait FromBytes
where
    Self: Sized,
{
    /// A way to convert the [`Bytes`] into the implementing type without consuming the original bytes.
    ///
    /// # Errors
    ///
    /// There are several reasons why this conversion might fail returning an [`errors::SDKError`]:
    ///
    /// - [`errors::SDKError::FromUtf8Error`] if the bytes are not valid UTF-8.
    /// - [`errors::SDKError::NumBytesConversion`] if the bytes are not of the expected length for the type of number primitive.
    /// - [`errors::SDKError::InvalidValue`] if the bytes do not represent a valid value for the type.
    /// - [`errors::SDKError::Serde`] if the bytes cannot be deserialized into the type.
    ///
    /// # Examples
    ///
    /// ```
    /// use seda_sdk_rs::bytes::{FromBytes, ToBytes};
    /// let bytes = "Hello, world!".to_bytes();
    /// let string: String = String::from_bytes(&bytes).expect("Should be valid UTF-8");
    /// assert_eq!(string, "Hello, world!");
    /// ```
    fn from_bytes(bytes: &[u8]) -> Result<Self>;

    /// A way to convert the [`Bytes`] into the implementing type and consume the original bytes.
    ///
    /// # Errors
    ///
    /// There are several reasons why this conversion might fail returning an [`errors::SDKError`]:
    ///
    /// - [`errors::SDKError::FromUtf8Error`] if the bytes are not valid UTF-8.
    /// - [`errors::SDKError::NumBytesConversion`] if the bytes are not of the expected length for the type of number primitive.
    /// - [`errors::SDKError::InvalidValue`] if the bytes do not represent a valid value for the type.
    /// - [`errors::SDKError::Serde`] if the bytes cannot be deserialized into the type.
    ///
    /// # Examples
    ///
    /// ```
    /// use seda_sdk_rs::bytes::{FromBytes, ToBytes};
    /// let bytes = "Hello, world!".to_bytes();
    /// let string: String = String::from_bytes_vec(bytes.eject()).expect("Should be valid UTF-8");
    /// assert_eq!(string, "Hello, world!");
    /// ```
    fn from_bytes_vec(bytes: Vec<u8>) -> Result<Self>;
}

impl FromBytes for Vec<u8> {
    fn from_bytes(bytes: &[u8]) -> Result<Self> {
        Ok(bytes.to_vec())
    }

    fn from_bytes_vec(bytes: Vec<u8>) -> Result<Self> {
        Ok(bytes)
    }
}

impl FromBytes for String {
    fn from_bytes(bytes: &[u8]) -> Result<Self> {
        Ok(std::str::from_utf8(bytes)?.into())
    }

    fn from_bytes_vec(bytes: Vec<u8>) -> Result<Self> {
        Self::from_bytes(bytes.as_slice())
    }
}

impl FromBytes for bool {
    fn from_bytes(bytes: &[u8]) -> Result<Self> {
        match bytes[0] {
            0 => Ok(false),
            1 => Ok(true),
            _ => Err(errors::SDKError::InvalidValue),
        }
    }

    fn from_bytes_vec(bytes: Vec<u8>) -> Result<Self> {
        if bytes.len() != 1 {
            Err(errors::SDKError::InvalidValue)
        } else {
            Self::from_bytes(bytes.as_slice())
        }
    }
}

macro_rules! bytes_impls_le_bytes {
    ($type_:ty, $num_bytes:expr) => {
        impl ToBytes for $type_ {
            fn to_bytes(self) -> Bytes {
                Bytes(self.to_le_bytes().to_vec())
            }
        }

        impl FromBytes for $type_ {
            fn from_bytes(bytes: &[u8]) -> Result<Self> {
                let bytes: [u8; $num_bytes] = bytes.try_into()?;
                Ok(<$type_>::from_le_bytes(bytes))
            }

            fn from_bytes_vec(bytes: Vec<u8>) -> Result<Self> {
                Self::from_bytes(bytes.as_slice())
            }
        }
    };
}

/// Implements `ToBytes` and `FromBytes` via JSON serialization/deserialization for the given type.
///
/// This macro generates:
/// - a `ToBytes` impl that serializes the type to a `Vec<u8>` using `serde_json::to_vec`
///   and wraps it in `seda_sdk_rs::Bytes`.
/// - a `FromBytes` impl that deserializes from a `&[u8]` or `Vec<u8>` using `serde_json::from_slice`.
///
/// # Example
///
/// # Example
///
/// ```
/// use serde::{Serialize, Deserialize};
/// use seda_sdk_rs::bytes::{Bytes, ToBytes, FromBytes};
/// use seda_sdk_rs::bytes_serde_json;
///
/// #[derive(Serialize, Deserialize, PartialEq, Clone, Debug)]
/// struct MyType { foo: String, bar: i32 }
///
/// // Generate the ToBytes/FromBytes impls
/// bytes_serde_json!(MyType);
///
/// let original = MyType { foo: "hi".into(), bar: 123 };
/// let bytes = original.clone().to_bytes();
/// let decoded = MyType::from_bytes(&bytes).unwrap();
/// assert_eq!(original, decoded);
/// ```
#[macro_export]
macro_rules! bytes_serde_json {
    ($type_:ty) => {
        impl $crate::bytes::ToBytes for $type_ {
            fn to_bytes(self) -> $crate::bytes::Bytes {
                serde_json::to_vec(&self).unwrap().to_bytes()
            }
        }

        impl $crate::bytes::FromBytes for $type_ {
            fn from_bytes(bytes: &[u8]) -> $crate::errors::Result<Self> {
                Ok(serde_json::from_slice(bytes)?)
            }

            fn from_bytes_vec(bytes: Vec<u8>) -> $crate::errors::Result<Self> {
                Self::from_bytes(&bytes)
            }
        }
    };
}

bytes_impls_le_bytes!(u8, 1);
bytes_impls_le_bytes!(u32, 4);
bytes_impls_le_bytes!(u64, 8);
bytes_impls_le_bytes!(u128, 16);
bytes_impls_le_bytes!(i8, 1);
bytes_impls_le_bytes!(i32, 4);
bytes_impls_le_bytes!(i64, 8);
bytes_impls_le_bytes!(i128, 16);
bytes_impls_le_bytes!(f32, 4);
bytes_impls_le_bytes!(f64, 8);
