use seda_sdk_rs::{bytes::ToBytes, http::http_fetch, process::Process};

pub fn test_tally_vm_mode() {
    if Process::is_dr_vm_mode() {
        Process::error(&"dr".to_bytes());
    } else {
        Process::success(&"tally".to_bytes());
    }
}

pub fn test_tally_vm_http() {
    let response = http_fetch(
        "https://api.binance.com/api/v3/ticker/price?symbol=eth-usdt",
        None,
    );

    if response.is_ok() {
        Process::error(&"this should not be allowed in tally mode".to_bytes());
        return;
    }

    Process::success(&response.bytes);
}
