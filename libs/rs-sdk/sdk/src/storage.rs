//! Storage operations for persisting data across oracle program executions.

use crate::{
    bytes::FromBytes,
    errors::{Result, SDKError},
    hashmap::HashMap,
    promise::PromiseStatus,
};

/// Appends `bytes` to `out` as lowercase hex.
fn push_hex(out: &mut Vec<u8>, bytes: &[u8]) {
    let start = out.len();
    out.resize(start + bytes.len() * 2, 0);
    // Infallible: the destination was sized to exactly twice the input length.
    const_hex::encode_to_slice(bytes, &mut out[start..]).expect("hex buffer is correctly sized");
}

/// Encodes a `{"keys":[...]}` action payload.
///
/// Hex contains no characters that require JSON escaping, so the keys are
/// concatenated directly rather than routed through a serializer.
fn encode_keys_action(keys: &[impl AsRef<[u8]>]) -> Vec<u8> {
    let hex_len: usize = keys.iter().map(|key| key.as_ref().len() * 2).sum();
    // `{"keys":[]}` plus two quotes and a separating comma per key.
    let mut action = Vec::with_capacity(hex_len + keys.len() * 3 + 11);

    action.extend_from_slice(b"{\"keys\":[");
    for (index, key) in keys.iter().enumerate() {
        if index > 0 {
            action.push(b',');
        }

        action.push(b'"');
        push_hex(&mut action, key.as_ref());
        action.push(b'"');
    }
    action.extend_from_slice(b"]}");

    action
}

/// Encodes a `{"values":{...}}` action payload.
fn encode_values_action(entries: &[(impl AsRef<[u8]>, impl AsRef<[u8]>)]) -> Vec<u8> {
    let hex_len: usize = entries
        .iter()
        .map(|(key, value)| (key.as_ref().len() + value.as_ref().len()) * 2)
        .sum();
    // `{"values":{}}` plus four quotes, a colon and a separating comma per entry.
    let mut action = Vec::with_capacity(hex_len + entries.len() * 6 + 13);

    action.extend_from_slice(b"{\"values\":{");
    for (index, (key, value)) in entries.iter().enumerate() {
        if index > 0 {
            action.push(b',');
        }

        action.push(b'"');
        push_hex(&mut action, key.as_ref());
        action.extend_from_slice(b"\":\"");
        push_hex(&mut action, value.as_ref());
        action.push(b'"');
    }
    action.extend_from_slice(b"}}");

    action
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
/// more than once the host applies the writes in order, so the last one wins.
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

    let action = encode_values_action(entries);
    let result_length = unsafe { super::raw::storage_write(action.as_ptr(), action.len() as u32) };
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

    let action = encode_keys_action(keys);
    let result_length = unsafe { super::raw::storage_delete(action.as_ptr(), action.len() as u32) };
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

    let action = encode_keys_action(keys);
    let result_length = unsafe { super::raw::storage_read(action.as_ptr(), action.len() as u32) };

    let payload = read_call_result(result_length)?;
    let Some(payload) = payload.filter(|payload| !payload.is_empty()) else {
        return Ok(keys.iter().map(|_| None).collect());
    };

    // The host keys its response by hex. Deterministic hashing keeps this free of
    // the randomized seeds that tally oracle programs disallow; the map is only
    // ever looked up in caller order, never iterated, so it cannot leak an order.
    let entries: HashMap<String, Option<Vec<u8>>> = serde_json::from_slice(&payload)?;

    let mut values = Vec::with_capacity(keys.len());
    let mut hex_key = Vec::new();
    for key in keys {
        hex_key.clear();
        push_hex(&mut hex_key, key.as_ref());

        // Hex is always valid UTF-8, so this only fails if the encoder is broken.
        let stored = entries
            .get(std::str::from_utf8(&hex_key)?)
            .and_then(|value| value.as_deref());

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
