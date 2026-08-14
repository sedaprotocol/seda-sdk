//! Storage operations for persisting data across oracle program executions.

use serde::Serialize;

use crate::{
    bytes::FromBytes,
    errors::{Result, SDKError},
    hashmap::HashMap,
    promise::PromiseStatus,
};

#[derive(Serialize)]
struct StorageReadAction {
    keys: Vec<String>,
}

#[derive(Serialize)]
struct StorageWriteAction {
    values: HashMap<String, String>,
}

#[derive(Serialize)]
struct StorageDeleteAction {
    keys: Vec<String>,
}

/// Reads back the result of a host call and returns the fulfilled payload.
///
/// # Errors
///
/// Returns [`SDKError::PromiseRejected`] if the host rejected the action, for
/// example when a key or value exceeds the configured size limit.
fn read_call_result(result_length: u32) -> Result<Option<Vec<u8>>> {
    let mut result_data = vec![0u8; result_length as usize];
    unsafe {
        super::raw::call_result_write(result_data.as_mut_ptr(), result_length);
    }

    match serde_json::from_slice(&result_data)? {
        PromiseStatus::Fulfilled(payload) => Ok(payload),
        PromiseStatus::Rejected(error) => Err(SDKError::PromiseRejected(String::from_utf8(error)?)),
    }
}

/// Writes multiple key-value pairs to storage in a single host call.
///
/// Existing keys not named in `entries` are left untouched. If a key appears
/// more than once only the last value is sent to the host.
///
/// # Errors
///
/// Returns [`SDKError::PromiseRejected`] if the host rejected the write, for
/// example when a key or value exceeds the configured size limit.
///
/// # Examples
///
/// ```no_run
/// use seda_sdk_rs::storage;
/// storage::insert_many(&[("owner", "alice"), ("region", "eu")])?;
/// # Ok::<(), seda_sdk_rs::errors::SDKError>(())
/// ```
pub fn insert_many(entries: &[(impl AsRef<[u8]>, impl AsRef<[u8]>)]) -> Result<()> {
    if entries.is_empty() {
        return Ok(());
    }

    let action = StorageWriteAction {
        values: entries
            .iter()
            .map(|(key, value)| (hex::encode(key), hex::encode(value)))
            .collect(),
    };
    let action_json = serde_json::to_string(&action)?;

    let result_length = unsafe { super::raw::storage_write(action_json.as_ptr(), action_json.len() as u32) };
    read_call_result(result_length)?;

    Ok(())
}

/// Writes a single key-value pair to storage, leaving every other key untouched.
///
/// Prefer [`insert_many`] when writing more than one key. Every host call is
/// charged base gas and crosses into the host, so a single batched call is
/// cheaper than the same writes issued one at a time.
///
/// Unlike [`std::collections::HashMap::insert`] this does not return the
/// displaced value, which would cost an additional host call. Read the key
/// first if the previous value is needed.
///
/// # Errors
///
/// Returns [`SDKError::PromiseRejected`] if the host rejected the write, for
/// example when the key or value exceeds the configured size limit.
///
/// # Examples
///
/// ```no_run
/// use seda_sdk_rs::storage;
/// storage::insert("owner", "alice")?;
/// storage::insert(b"nonce", 42u64.to_le_bytes())?;
/// # Ok::<(), seda_sdk_rs::errors::SDKError>(())
/// ```
pub fn insert(key: impl AsRef<[u8]>, value: impl AsRef<[u8]>) -> Result<()> {
    insert_many(&[(key, value)])
}

/// Deletes multiple keys from storage in a single host call.
///
/// Keys that are not present are ignored.
///
/// # Errors
///
/// Returns [`SDKError::PromiseRejected`] if the host rejected the delete, for
/// example when a key exceeds the configured size limit.
pub fn remove_many(keys: &[impl AsRef<[u8]>]) -> Result<()> {
    if keys.is_empty() {
        return Ok(());
    }

    let action = StorageDeleteAction {
        keys: keys.iter().map(hex::encode).collect(),
    };
    let action_json = serde_json::to_string(&action)?;

    let result_length = unsafe { super::raw::storage_delete(action_json.as_ptr(), action_json.len() as u32) };
    read_call_result(result_length)?;

    Ok(())
}

/// Deletes a single key from storage, ignoring keys that are not present.
///
/// Prefer [`remove_many`] when deleting more than one key. Every host call is
/// charged base gas and crosses into the host, so a single batched call is
/// cheaper than the same deletes issued one at a time.
///
/// Unlike [`std::collections::HashMap::remove`] this does not return the
/// removed value, which would cost an additional host call.
///
/// # Errors
///
/// Returns [`SDKError::PromiseRejected`] if the host rejected the delete, for
/// example when the key exceeds the configured size limit.
pub fn remove(key: impl AsRef<[u8]>) -> Result<()> {
    remove_many(&[key])
}

/// Reads multiple keys from storage in a single host call.
///
/// The result is positional: index `i` holds the value for `keys[i]`, and is
/// [`None`] when that key is not present in storage.
///
/// # Errors
///
/// Returns [`SDKError::PromiseRejected`] if the host rejected the read, for
/// example when a key exceeds the configured size limit. Returns an error from
/// [`FromBytes::from_bytes`] if a stored value cannot be decoded as `T`, which
/// is distinct from the key being absent.
///
/// # Examples
///
/// ```no_run
/// use seda_sdk_rs::storage;
/// let values: Vec<Option<String>> = storage::get_many(&["owner", "region"])?;
/// # Ok::<(), seda_sdk_rs::errors::SDKError>(())
/// ```
pub fn get_many<T: FromBytes>(keys: &[impl AsRef<[u8]>]) -> Result<Vec<Option<T>>> {
    if keys.is_empty() {
        return Ok(Vec::new());
    }

    let action = StorageReadAction {
        keys: keys.iter().map(hex::encode).collect(),
    };
    let action_json = serde_json::to_string(&action)?;

    let result_length = unsafe { super::raw::storage_read(action_json.as_ptr(), action_json.len() as u32) };
    let payload = read_call_result(result_length)?;
    let Some(payload) = payload.filter(|payload| !payload.is_empty()) else {
        return Ok(keys.iter().map(|_| None).collect());
    };

    // The host keys its response by hex, so look each requested key back up by
    // its own encoding to rebuild the caller's ordering.
    let entries: HashMap<String, Option<Vec<u8>>> = serde_json::from_slice(&payload)?;

    let mut values = Vec::with_capacity(keys.len());
    for key in keys {
        let stored = entries.get(&hex::encode(key)).and_then(|value| value.as_deref());
        values.push(stored.map(T::from_bytes).transpose()?);
    }

    Ok(values)
}

/// Reads a single key from storage, returning [`None`] if it is not present.
///
/// Prefer [`get_many`] when reading more than one key. Every host call is
/// charged base gas and crosses into the host, so a single batched call is
/// cheaper than the same reads issued one at a time.
///
/// # Errors
///
/// Returns [`SDKError::PromiseRejected`] if the host rejected the read, for
/// example when the key exceeds the configured size limit. Returns an error
/// from [`FromBytes::from_bytes`] if the stored value cannot be decoded as `T`,
/// which is distinct from the key being absent.
///
/// # Examples
///
/// ```no_run
/// use seda_sdk_rs::storage;
/// let owner: Option<String> = storage::get("owner")?;
/// let nonce = storage::get::<u64>(b"nonce")?;
/// # Ok::<(), seda_sdk_rs::errors::SDKError>(())
/// ```
pub fn get<T: FromBytes>(key: impl AsRef<[u8]>) -> Result<Option<T>> {
    Ok(get_many(&[key])?.pop().flatten())
}
