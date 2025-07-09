# Rust SDK
[![](https://img.shields.io/crates/v/seda-sdk-rs.svg)](https://crates.io/crates/seda-sdk-rs) [![](https://docs.rs/seda-sdk-rs/badge.svg)](https://docs.rs/seda-sdk-rs)

SDK for creating Oracle Programs on the SEDA chain.

## Caveats

When writing Oracle Programs in Rust for SEDA, there are several important considerations to keep in mind:

### Logging and Debugging

The standard Rust logging macros like `println!`, `eprintln!`, and `dbg!` are not suitable for use in Oracle Programs as they consume large amounts of gas. Instead, we provide the `Console` module which offers gas-efficient alternatives:

- `debug!` - `dbg!` alternative. Used for printing debug information to std err
- `log!` - `println!` alternative. Used for logging to std out
- `elog!` - `eprintln!` alternative. Used for logging to std err

### Stripped Panic Messages

By default when SDK is imported and used it turns on the `hide-panic-paths` feature. This feature sets a panic hook to remove location details as to not show the filepath of the person who compiled the Oracle Program. It attempts to retain the panic message details, but if it cannot it instead `elogs!("<panic>");`.

If you run into the above and wish to see the full message, note that it will print the path of where the panic occurred(downloaded crates or your oracle program), you can disable this feature. That can be done via your `Cargo.toml` and doing `seda-sdk-rs = { git = "https://github.com/sedaprotocol/seda-sdk", tag/version/branch = "some_qualifier", default-features = false }`.

### Determinism and the Tally Phase

While the execution phase of an Oracle Program has access to non-deterministic data, the tally phase of an Oracle Program must be deterministic. This means it produces the same output given the same input. When you or a library tries to access randomness the program will halt and exit with an error.

The standard `HashMap` from `std::collections` can't be used without a custom hasher, as the default hasher relies on randomness for the initial seed. Instead try one of the following:

- `BTreeMap` - For key-value storage with ordered keys
- `Vec` with manual key lookups - For smaller datasets
- Our provided `seda_sdk_rs::HashMap` - A wrapper around `std::collections::HashMap` with a deterministic hasher

## Example

Below is an example of an Oracle Program that retrieves the name of a planet in the SWAPI database.

```rs
use seda_sdk_rs::{bytes::ToBytes, http::http_fetch, process::Process};
use serde::Deserialize;

// The JSON schema of the response we're expecting.
#[derive(Deserialize)]
struct SwPlanet {
  name: String,
}
use seda_sdk_rs::{bytes::ToBytes, http::http_fetch, process::Process};

#[seda_sdk_rs::oracle_program]
impl SimplePriceFeed {
  fn execute() {
    let input = Process::get_inputs();

    // HTTP Fetch to the SWAPI
    let response = http_fetch(
      format!("https://swapi.dev/api/planets/{}", String::from_utf8(input).unwrap()),
      None,
    );

    if response.is_ok() {
      // We need to parse the response Bytes as the expected JSON.
      let data = serde_json::from_slice::<SwPlanet>(&response.bytes).unwrap();

      // Exits the program (with an exit code of 0) and sets the Data Request result to the planet name
      Process::success(&format!("{}", data.name).to_bytes());
    } else {
      Process::error(&"Error while fetching".to_bytes());
    }
  }

  fn tally() {
    Process::error(&"Tally was not implemented (yet)".to_bytes());
  }
}
```
