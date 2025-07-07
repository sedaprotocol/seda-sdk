use seda_sdk_rs::process::Process;

pub fn test_clock_time_get() {
    let result = std::time::SystemTime::now();
    let result = result.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis();

    Process::exit_with_result(0, result.to_string().as_bytes());
}
