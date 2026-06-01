//! Storage operations for persisting data across oracle program executions.

use std::collections::BTreeMap;

use serde::Serialize;

use crate::{
    errors::{Result, SDKError},
    promise::PromiseStatus,
};

#[derive(Serialize)]
struct StorageReadAction {
    keys: Vec<String>,
}

#[derive(Serialize)]
struct StorageWriteAction {
    values: BTreeMap<String, String>,
}

#[derive(Serialize)]
struct StorageDeleteAction {
    keys: Vec<String>,
}

/// Writes multiple key-value pairs to storage.
///
/// # Errors
///
/// Returns an error if the host rejected the write, for example when a key or
/// value exceeds the configured size limit.
pub fn storage_write(entries: &[(&[u8], &[u8])]) -> Result<()> {
    let values: BTreeMap<String, String> = entries.iter().map(|(k, v)| (hex::encode(k), hex::encode(v))).collect();

    let action = StorageWriteAction { values };
    let action_json = serde_json::to_string(&action)?;

    let result_length = unsafe { super::raw::storage_write(action_json.as_ptr(), action_json.len() as u32) };
    let mut result_data = vec![0u8; result_length as usize];
    unsafe {
        super::raw::call_result_write(result_data.as_mut_ptr(), result_length);
    }

    match serde_json::from_slice(&result_data)? {
        PromiseStatus::Fulfilled(_) => Ok(()),
        PromiseStatus::Rejected(error) => Err(SDKError::PromiseRejected(String::from_utf8(error)?)),
    }
}

/// Reads multiple keys from storage. Returns a map containing every
/// requested key — the value is `Some(bytes)` if the key exists,
/// or `None` if it does not.
///
/// # Errors
///
/// Returns an error if the host rejected the read, for example when a key
/// exceeds the configured size limit.
pub fn storage_read(keys: &[&[u8]]) -> Result<BTreeMap<String, Option<Vec<u8>>>> {
    let action = StorageReadAction {
        keys: keys.iter().map(hex::encode).collect(),
    };
    let action_json = serde_json::to_string(&action)?;

    let result_length = unsafe { super::raw::storage_read(action_json.as_ptr(), action_json.len() as u32) };
    let mut result_data = vec![0u8; result_length as usize];
    unsafe {
        super::raw::call_result_write(result_data.as_mut_ptr(), result_length);
    }

    match serde_json::from_slice(&result_data)? {
        PromiseStatus::Fulfilled(Some(bytes)) if !bytes.is_empty() => Ok(serde_json::from_slice(&bytes)?),
        PromiseStatus::Fulfilled(_) => Ok(BTreeMap::new()),
        PromiseStatus::Rejected(error) => Err(SDKError::PromiseRejected(String::from_utf8(error)?)),
    }
}

/// Deletes multiple keys from storage.
///
/// # Errors
///
/// Returns an error if the host rejected the delete, for example when a key
/// exceeds the configured size limit.
pub fn storage_delete(keys: &[&[u8]]) -> Result<()> {
    let action = StorageDeleteAction {
        keys: keys.iter().map(hex::encode).collect(),
    };
    let action_json = serde_json::to_string(&action)?;

    let result_length = unsafe { super::raw::storage_delete(action_json.as_ptr(), action_json.len() as u32) };
    let mut result_data = vec![0u8; result_length as usize];
    unsafe {
        super::raw::call_result_write(result_data.as_mut_ptr(), result_length);
    }

    match serde_json::from_slice(&result_data)? {
        PromiseStatus::Fulfilled(_) => Ok(()),
        PromiseStatus::Rejected(error) => Err(SDKError::PromiseRejected(String::from_utf8(error)?)),
    }
}
