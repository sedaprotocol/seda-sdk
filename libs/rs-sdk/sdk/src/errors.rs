use thiserror::Error;

#[derive(Debug, Error)]
pub enum SDKError {
    #[error(transparent)]
    Serde(#[from] serde_json::Error),

    #[error(transparent)]
    FromUtf8Error(#[from] std::string::FromUtf8Error),

    #[error("{0:?}")]
    StringBytesConversion(#[from] std::str::Utf8Error),

    #[error(transparent)]
    NumBytesConversion(#[from] std::array::TryFromSliceError),

    #[error("Invalid value")]
    InvalidValue,
}

pub type Result<T, E = SDKError> = core::result::Result<T, E>;
