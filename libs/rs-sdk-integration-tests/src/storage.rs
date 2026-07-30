use seda_sdk_rs::{bytes::ToBytes, process::Process, storage};

// Mirrors the limits enforced by the VM's DataRequestVmAdapter.
const MAX_KEY_BYTES: usize = 256;
const MAX_VALUE_BYTES: usize = 1024;

pub fn test_storage_write() {
    storage::insert_many(&[("key_a", "value_a"), ("key_b", "value_b")]).unwrap();
    Process::success(&"ok".to_bytes());
}

pub fn test_storage_read() {
    storage::insert_many(&[("r1", "alpha"), ("r2", "beta")]).unwrap();

    let result: Vec<Option<String>> = storage::get_many(&["r1", "r2", "missing"]).unwrap();

    if result[0].as_deref() != Some("alpha") {
        Process::error(&"r1 mismatch".to_bytes());
    }

    if result[1].as_deref() != Some("beta") {
        Process::error(&"r2 mismatch".to_bytes());
    }

    if result[2].is_some() {
        Process::error(&"missing key should read as None".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

// Writes two keys in separate calls to prove a write merges into storage rather
// than replacing it, which is what makes the single-key `insert` sound.
pub fn test_storage_insert_merges() {
    storage::insert("m1", "one").unwrap();
    storage::insert("m2", "two").unwrap();

    let result: Vec<Option<String>> = storage::get_many(&["m1", "m2"]).unwrap();

    if result[0].as_deref() != Some("one") {
        Process::error(&"m1 should survive a later write to a different key".to_bytes());
    }

    if result[1].as_deref() != Some("two") {
        Process::error(&"m2 should have been written".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

pub fn test_storage_insert_overwrites() {
    storage::insert("o1", "first").unwrap();
    storage::insert("o1", "second").unwrap();

    let value: Option<String> = storage::get("o1").unwrap();

    if value.as_deref() != Some("second") {
        Process::error(&"o1 should hold the most recent value".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

// A key repeated within one call is sent twice; the host applies them in order.
pub fn test_storage_insert_many_duplicate_keys() {
    storage::insert_many(&[("dup", "first"), ("dup", "second")]).unwrap();

    let value: Option<String> = storage::get("dup").unwrap();

    if value.as_deref() != Some("second") {
        Process::error(&"the last write to a duplicated key should win".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

// Empty inputs short-circuit without reaching the host.
pub fn test_storage_empty_inputs() {
    let no_entries: [(&str, &str); 0] = [];
    if storage::insert_many(&no_entries).is_err() {
        Process::error(&"an empty insert_many should succeed".to_bytes());
    }

    let no_keys: [&str; 0] = [];
    if storage::remove_many(&no_keys).is_err() {
        Process::error(&"an empty remove_many should succeed".to_bytes());
    }

    let values: Vec<Option<String>> = storage::get_many(&no_keys).unwrap();
    if !values.is_empty() {
        Process::error(&"an empty get_many should return no values".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

pub fn test_storage_delete() {
    storage::insert_many(&[("d1", "one"), ("d2", "two")]).unwrap();
    storage::remove("d1").unwrap();

    let result: Vec<Option<String>> = storage::get_many(&["d1", "d2"]).unwrap();

    if result[0].is_some() {
        Process::error(&"d1 should be None after delete".to_bytes());
    }
    if result[1].as_deref() != Some("two") {
        Process::error(&"d2 should still exist".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

// Reads the keys written by `test_storage_write` without writing them first
pub fn test_storage_read_persisted() {
    let result: Vec<Option<String>> = storage::get_many(&["key_a", "key_b"]).unwrap();

    if result[0].as_deref() != Some("value_a") {
        Process::error(&"key_a not persisted".to_bytes());
    }

    if result[1].as_deref() != Some("value_b") {
        Process::error(&"key_b not persisted".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

// Deletes a key that was persisted by a previous execution without writing it first.
pub fn test_storage_delete_persisted() {
    storage::remove("key_a").unwrap();
    Process::success(&"ok".to_bytes());
}

pub fn test_storage_write_value_limit() {
    // A value exactly at the limit is accepted.
    let at_limit_value = vec![b'a'; MAX_VALUE_BYTES];
    if storage::insert("v_at_limit", &at_limit_value).is_err() {
        Process::error(&"value at the limit should be accepted".to_bytes());
    }

    // A value over the limit is rejected.
    let over_limit_value = vec![b'a'; MAX_VALUE_BYTES + 1];
    if storage::insert("v_over_limit", &over_limit_value).is_ok() {
        Process::error(&"value over the limit should be rejected".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

pub fn test_storage_write_key_limit() {
    // A key exactly at the limit is accepted.
    let at_limit_key = vec![b'k'; MAX_KEY_BYTES];
    if storage::insert(&at_limit_key, "value").is_err() {
        Process::error(&"key at the limit should be accepted".to_bytes());
    }

    // A key over the limit is rejected.
    let over_limit_key = vec![b'k'; MAX_KEY_BYTES + 1];
    if storage::insert(&over_limit_key, "value").is_ok() {
        Process::error(&"key over the limit should be rejected".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

pub fn test_storage_read_key_limit() {
    // A key exactly at the limit is accepted.
    let at_limit_key = vec![b'k'; MAX_KEY_BYTES];
    if storage::get::<Vec<u8>>(&at_limit_key).is_err() {
        Process::error(&"read with a key at the limit should be allowed".to_bytes());
    }

    // A key over the limit is rejected.
    let over_limit_key = vec![b'k'; MAX_KEY_BYTES + 1];
    if storage::get::<Vec<u8>>(&over_limit_key).is_ok() {
        Process::error(&"read with an over-limit key should be rejected".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

pub fn test_storage_delete_key_limit() {
    // A key exactly at the limit is accepted.
    let at_limit_key = vec![b'k'; MAX_KEY_BYTES];
    if storage::remove(&at_limit_key).is_err() {
        Process::error(&"delete with a key at the limit should be allowed".to_bytes());
    }

    // A key over the limit is rejected.
    let over_limit_key = vec![b'k'; MAX_KEY_BYTES + 1];
    if storage::remove(&over_limit_key).is_ok() {
        Process::error(&"delete with an over-limit key should be rejected".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}
