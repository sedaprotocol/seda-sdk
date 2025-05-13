use seda_sdk_rs::{log, process::Process};

pub fn test_clock_time_get() {
    // get current time
    let now = std::time::SystemTime::now();
    let timestamp = now.duration_since(std::time::UNIX_EPOCH).unwrap().as_secs();
    log!("timestamp: {}", timestamp);

    Process::success(format!("The time is {}", timestamp).as_bytes());
}