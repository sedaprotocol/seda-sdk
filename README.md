<p align="center">
  <a href="https://seda.xyz/">
    <img width="90%" alt="seda-chain" src="https://raw.githubusercontent.com/sedaprotocol/.github/refs/heads/main/images/banner.png">
  </a>
</p>

<h1 align="center">
  SEDA SDK
</h1>

[![Build Status][actions-badge]][actions-url]
[![GitHub Stars][github-stars-badge]](https://github.com/sedaprotocol/seda-sdk)
[![GitHub Contributors][github-contributors-badge]](https://github.com/sedaprotocol/seda-sdk/graphs/contributors)
[![Discord chat][discord-badge]][discord-url]
[![Twitter][twitter-badge]][twitter-url]

[actions-badge]: https://github.com/sedaprotocol/seda-sdk/actions/workflows/push.yml/badge.svg
[actions-url]: https://github.com/sedaprotocol/seda-sdk/actions/workflows/push.yml+branch%3Amain
[github-stars-badge]: https://img.shields.io/github/stars/sedaprotocol/seda-sdk.svg?style=flat-square&label=github%20stars
[github-contributors-badge]: https://img.shields.io/github/contributors/sedaprotocol/seda-sdk.svg?style=flat-square
[discord-badge]: https://img.shields.io/discord/500028886025895936.svg?logo=discord&style=flat-square
[discord-url]: https://discord.gg/seda
[twitter-badge]: https://img.shields.io/twitter/url/https/twitter.com/SedaProtocol.svg?style=social&label=Follow%20%40SedaProtocol
[twitter-url]: https://twitter.com/SedaProtocol

Collection of packages which allow you to build SEDA Data Requests:

- [rs-sdk](./libs/rs-sdk/README.md) - [Rust](https://www.rust-lang.org/) SDK to help building Oracle Programs in Rust
- ~~[as-sdk](./libs/as-sdk/README.md) - [AssemblyScript](https://www.assemblyscript.org/) SDK to help building Oracle Programs in AssemblyScript~~ (deprecated until improvements are available)
- [dev-tools](./libs/dev-tools/README.md) - Command Line Interface for uploading and listing Oracle Programs as well as tools for testing Oracle Programs and interacting with the SEDA network
- [vm](./libs/vm/README.md) - Virtual Machine which can run Oracle Programs locally for testing

# Quick getting started

The easiest way to get started it by using our [starter kit](https://github.com/sedaprotocol/seda-request-starter-kit) this has all the tools installed that you need:

- Rust
- WASI
- SEDA SDK
- SEDA Dev Tools
- SEDA VM

## Example

Below is an example of an Oracle Program that retrieves the name of a planet in the SWAPI database.

## Rust

```rs
use seda_sdk_rs::{bytes::ToBytes, http::http_fetch, process::Process};
use serde::Deserialize;

// The JSON schema of the response we're expecting.
#[derive(Deserialize)]
struct SwPlanet {
  name: String,
}

fn main() {
  let input = Process::get_inputs();

  if Process::is_dr_vm_mode() {
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
  } else {
    Process::error(&"Tally was not implemented (yet)".to_bytes());
  }
}
```

## Testing

In order to test this we can use a JS testing suite (we use Bun:test in this repository and the starter kits, but any runner should work). We use the `@seda-protocol/dev-tools` package for this, which runs the Oracle Program in a similar environment as it would on the SEDA network:

```ts
import { testOracleProgramExecution } from "@seda-protocol/dev-tools";
import { readFile } from "node:fs/promises";

const WASM_PATH = "build/debug.wasm";

describe("Oracle Program: execution", () => {
  it("should be able to run", async () => {
    const oracleProgram = await readFile(WASM_PATH);

    // Calls our SEDA VM
    const vmResult = await testOracleProgramExecution(
      // The bytes of the Oracle Program
      oracleProgram,
      // Inputs for the Oracle Program
      Buffer.from("1")
    );

    expect(vmResult.exitCode).toBe(0);
    expect(vmResult.resultAsString).toBe("Tatooine");
  });
});
```

## AssemblyScript SDK (deprecated)

Due to limitations in AssemblyScript, the SDK is deprecated until improvements are available.

For API documentation check [the TypeDocs](https://sedaprotocol.github.io/seda-sdk/index.html), and for guides and examples check <LINK_HERE>.

```ts
import { Process, httpFetch, OracleProgram, Bytes, JSON } from "@seda-protocol/as-sdk/assembly";

// The JSON schema of the response we're expecting, since in AssemblyScript we need to deserialize JSON into structured objects
@json
class SwPlanet {
  name!: string;
}

class PlanetProgram extends OracleProgram {
  execution() {
    const input = Process.getInputs().toUtf8String();

    // HTTP Fetch to the SWAPI
    const response = httpFetch(`https://swapi.dev/api/planets/${input}`);

    if (response.ok) {
      // We need to parse the response Bytes as the expected JSON.
      const planet = response.bytes.toJSON<SwPlanet>();

      // Exits the program (with an exit code of 0) and sets the Data Request result to the planet name
      Process.success(Bytes.fromUtf8String(planet.name));
    } else {
      Process.error(Bytes.fromUtf8String("Error while fetching"));
    }
  }
}

new PlanetProgram().run();
```
