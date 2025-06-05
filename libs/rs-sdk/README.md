# Rust SDK

SDK for creating Oracle Programs on the SEDA chain.

## Caveats

- println, eprint, dbg alternatives
- Determinism
- HashMap

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
