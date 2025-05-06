use rand::Rng;
use seda_sdk_rs::{bytes::ToBytes, process::Process};

pub fn test_random_get() {
    let random_bytes = rand::rng().random_range(0..=u8::MAX);
    println!("Random bytes: {random_bytes:?}");

    Process::success(&random_bytes.to_bytes());
}
