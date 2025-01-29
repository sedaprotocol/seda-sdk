use std::fmt::Debug;

use serde::{Deserialize, Serialize};

use crate::{bytes::ToBytes, promise_actions::PromiseAction};

// TODO: Fulfilled and Rejected could now just be our Bytes type.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum PromiseStatus {
    /// The promise completed
    Fulfilled(Option<Vec<u8>>),

    /// There was an error executing this promise
    // TODO: Is there ever a case where Rejected isn't a string?
    // HTTP rejections could be an object(but encoded in a string).
    // Could private the type and then have methods or something.
    Rejected(Vec<u8>),
}

impl PromiseStatus {
    /// Helper function that immidiatly assumes that the promise has been
    /// fulfilled and return the value. Panics if result is not fulfilled
    pub fn fulfilled(self) -> Vec<u8> {
        if let Self::Fulfilled(Some(value)) = self {
            return value;
        }

        panic!("Promise is not fulfilled: {:?}", &self);
    }

    pub fn parse<T>(self) -> Result<T, T::Error>
    where
        T: TryFrom<Vec<u8>>,
        T: TryFrom<Vec<u8>, Error = serde_json::Error>,
    {
        let value = self.fulfilled();

        value.try_into()
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
            Ok(fulfilled) => {
                PromiseStatus::Fulfilled(fulfilled.map(|inner| inner.to_bytes().eject()))
            }
            Err(rejection) => PromiseStatus::Rejected(rejection.to_string().to_bytes().eject()),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Promise {
    /// The name of the action we should execute
    pub action: PromiseAction,

    /// The status of the promise, will include the result if it's fulfilled
    pub status: PromiseStatus,
}
