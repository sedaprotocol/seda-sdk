#![doc = include_str!("../../README.md")]
#![deny(missing_docs)]

pub mod bytes;
pub mod errors;
pub mod hashmap;
pub mod http;
pub mod keccak256;
pub mod log;
pub mod process;
pub mod promise;
mod promise_actions;
pub mod proxy_http_fetch;
mod raw;
pub mod secp256k1;
mod tally;
mod vm_modes;

pub use http::{http_fetch, HttpFetchMethod, HttpFetchOptions, HttpFetchResponse};
pub use keccak256::keccak256;
pub use process::Process;
pub use proxy_http_fetch::{generate_proxy_http_signing_message, proxy_http_fetch};
pub use secp256k1::secp256k1_verify;
pub use tally::*;

pub use seda_sdk_macros::oracle_program;

#[cfg(feature = "hide-panic-paths")]
/// A function run before the main function, via [`ctor::ctor`], to set a sanitized panic hook.
/// This hook takes the `std::panic::PanicInfo` and attempts to downcast the payload to a string.
/// If unsuccessful, it defaults to printing "<panic>".
/// It then gracefully aborts the process.
#[ctor::ctor]
fn init_sanitized_panic_hook() {
    std::panic::set_hook(Box::new(|info| {
        // print only the panic message, never the location
        let msg = info
            .payload()
            .downcast_ref::<&str>()
            .copied()
            .or_else(|| info.payload().downcast_ref::<String>().map(|s| s.as_str()))
            .unwrap_or("<panic>");
        elog!("panicked: {msg}");
        elog!("note: you can disable the `hide-panic-paths` feature to see the full panic message, including the file and line number.");
        std::process::abort();
    }));
}
