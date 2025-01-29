use seda_sdk_rs::{bytes::ToBytes, http::http_fetch, process::Process};

fn main() {
    let args = std::env::args().collect::<Vec<String>>();

    if Process::is_dr_vm_mode() {
        let response = http_fetch(
            "https://api.binance.com/api/v3/ticker/price?symbol=eth-usdt",
            None,
        );

        if !response.is_ok() {
            Process::error(&"The API call failed".to_bytes());
            return ();
        }

        Process::success(&"The API called completed".to_bytes());
    } else {
        println!("Tally was not implemented (yet)");
    }

    println!("Hello, world! {:?}", args);
}
