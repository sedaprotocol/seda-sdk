use seda_sdk_rs::{bytes::ToBytes, http::http_fetch, process::Process};

#[seda_sdk_rs::oracle_program]
impl SimplePriceFeed {
    fn execute() {
        let response = http_fetch(
            "https://api.binance.com/api/v3/ticker/price?symbol=eth-usdt",
            None,
        );

        if !response.is_ok() {
            Process::error(&"The API call failed".to_bytes());
            return;
        }

        Process::success(&"The API called completed".to_bytes());
    }
}
