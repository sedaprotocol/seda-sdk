use std::ops::Deref;

use serde::{Deserialize, Serialize};

use crate::{errors, errors::Result};

#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct Bytes(Vec<u8>);

impl Bytes {
    pub fn eject(self) -> Vec<u8> {
        self.0
    }
}

/// We implement Deref over the Bytes type allowing us to avoid a clone for
/// `FromBytes`.
impl Deref for Bytes {
    type Target = [u8];

    fn deref(&self) -> &Self::Target {
        self.0.as_slice()
    }
}

pub trait ToBytes {
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

/// For functions that return an `()` to be converted to a
/// [crate::PromiseStatus]
impl ToBytes for () {
    fn to_bytes(self) -> Bytes {
        Bytes::default()
    }
}

pub trait FromBytes
where
    Self: Sized,
{
    fn from_bytes(bytes: &[u8]) -> Result<Self>;

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

#[macro_export]
macro_rules! bytes_serde_json {
    ($type_:ty) => {
        impl ToBytes for $type_ {
            fn to_bytes(self) -> seda_runtime_sdk::Bytes {
                serde_json::to_vec(&self).unwrap().to_bytes()
            }
        }

        impl FromBytes for $type_ {
            fn from_bytes(bytes: &[u8]) -> seda_runtime_sdk::Result<Self> {
                Ok(serde_json::from_slice(bytes)?)
            }

            fn from_bytes_vec(bytes: Vec<u8>) -> seda_runtime_sdk::Result<Self> {
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
