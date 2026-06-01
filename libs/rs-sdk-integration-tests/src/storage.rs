use seda_sdk_rs::{bytes::ToBytes, process::Process, storage_delete, storage_read, storage_write};

// Mirrors the limits enforced by the VM's DataRequestVmAdapter.
const MAX_KEY_BYTES: usize = 256;
const MAX_VALUE_BYTES: usize = 1024;

pub fn test_storage_write() {
    storage_write(&[(b"key_a", b"value_a"), (b"key_b", b"value_b")]).unwrap();
    Process::success(&"ok".to_bytes());
}

pub fn test_storage_read() {
    storage_write(&[(b"r1", b"alpha"), (b"r2", b"beta")]).unwrap();

    let result = storage_read(&[b"r1", b"r2", b"missing"]).unwrap();

    let r1_key = hex::encode(b"r1");
    let r2_key = hex::encode(b"r2");
    let missing_key = hex::encode(b"missing");

    if result.get(&r1_key).and_then(|v| v.as_deref()) != Some(b"alpha".as_slice()) {
        Process::error(&"r1 mismatch".to_bytes());
    }

    if result.get(&r2_key).and_then(|v| v.as_deref()) != Some(b"beta".as_slice()) {
        Process::error(&"r2 mismatch".to_bytes());
    }

    if result.get(&missing_key) != Some(&None) {
        Process::error(&"missing key should be present as None".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

pub fn test_storage_delete() {
    storage_write(&[(b"d1", b"one"), (b"d2", b"two")]).unwrap();
    storage_delete(&[b"d1"]).unwrap();

    let result = storage_read(&[b"d1", b"d2"]).unwrap();

    let d1_key = hex::encode(b"d1");
    let d2_key = hex::encode(b"d2");

    if result.get(&d1_key) != Some(&None) {
        Process::error(&"d1 should be None after delete".to_bytes());
    }
    if result.get(&d2_key).and_then(|v| v.as_deref()) != Some(b"two".as_slice()) {
        Process::error(&"d2 should still exist".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

// Reads the keys written by `test_storage_write` without writing them first
pub fn test_storage_read_persisted() {
    let result = storage_read(&[b"key_a", b"key_b"]).unwrap();

    let key_a = hex::encode(b"key_a");
    let key_b = hex::encode(b"key_b");

    if result.get(&key_a).and_then(|v| v.as_deref()) != Some(b"value_a".as_slice()) {
        Process::error(&"key_a not persisted".to_bytes());
    }

    if result.get(&key_b).and_then(|v| v.as_deref()) != Some(b"value_b".as_slice()) {
        Process::error(&"key_b not persisted".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

// Deletes a key that was persisted by a previous execution without writing it first.
pub fn test_storage_delete_persisted() {
    storage_delete(&[b"key_a"]).unwrap();
    Process::success(&"ok".to_bytes());
}

pub fn test_storage_write_value_limit() {
    // A value exactly at the limit is accepted.
    let at_limit_value = vec![b'a'; MAX_VALUE_BYTES];
    if storage_write(&[(b"v_at_limit".as_slice(), at_limit_value.as_slice())]).is_err() {
        Process::error(&"value at the limit should be accepted".to_bytes());
    }

    // A value over the limit is rejected.
    let over_limit_value = vec![b'a'; MAX_VALUE_BYTES + 1];
    if storage_write(&[(b"v_over_limit".as_slice(), over_limit_value.as_slice())]).is_ok() {
        Process::error(&"value over the limit should be rejected".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

pub fn test_storage_write_key_limit() {
    // A key exactly at the limit is accepted.
    let at_limit_key = vec![b'k'; MAX_KEY_BYTES];
    if storage_write(&[(at_limit_key.as_slice(), b"value".as_slice())]).is_err() {
        Process::error(&"key at the limit should be accepted".to_bytes());
    }

    // A key over the limit is rejected.
    let over_limit_key = vec![b'k'; MAX_KEY_BYTES + 1];
    if storage_write(&[(over_limit_key.as_slice(), b"value".as_slice())]).is_ok() {
        Process::error(&"key over the limit should be rejected".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

pub fn test_storage_read_key_limit() {
    // A key exactly at the limit is accepted.
    let at_limit_key = vec![b'k'; MAX_KEY_BYTES];
    if storage_read(&[at_limit_key.as_slice()]).is_err() {
        Process::error(&"read with a key at the limit should be allowed".to_bytes());
    }

    // A key over the limit is rejected.
    let over_limit_key = vec![b'k'; MAX_KEY_BYTES + 1];
    if storage_read(&[over_limit_key.as_slice()]).is_ok() {
        Process::error(&"read with an over-limit key should be rejected".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}

pub fn test_storage_delete_key_limit() {
    // A key exactly at the limit is accepted.
    let at_limit_key = vec![b'k'; MAX_KEY_BYTES];
    if storage_delete(&[at_limit_key.as_slice()]).is_err() {
        Process::error(&"delete with a key at the limit should be allowed".to_bytes());
    }

    // A key over the limit is rejected.
    let over_limit_key = vec![b'k'; MAX_KEY_BYTES + 1];
    if storage_delete(&[over_limit_key.as_slice()]).is_ok() {
        Process::error(&"delete with an over-limit key should be rejected".to_bytes());
    }

    Process::success(&"ok".to_bytes());
}
