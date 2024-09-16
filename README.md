<p align="center">
  <a href="https://seda.xyz/">
    <img width="90%" alt="seda-sdk" src="https://www.seda.xyz/images/footer/footer-image.png">
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

- [as-sdk](./libs/as-sdk/README.md) - [AssemblyScript](https://www.assemblyscript.org/) SDK to help building Oracle Programs
- [dev-tools](./libs/dev-tools/README.md) - Command Line Interface for uploading and listing Oracle Programs
- [vm](./libs/vm/README.md) - Virtual Machine which can run Oracle Programs locally for testing

# Quick getting started

The easiest way to get started it by using our [starter kit](https://github.com/sedaprotocol/seda-sdk-starter-template) this has all the tools installed that you need:

- AssemblyScript
- JSON-AS
- WASI
- SEDA SDK
- SEDA Dev Tools
- SEDA VM

For API documentation check [the TypeDocs](https://sedaprotocol.github.io/seda-sdk/index.html), and for guides and examples check <LINK_HERE>.

## Example

Below is an example of an Oracle Program that retrieves the name of a planet in the SWAPI database.

```ts
import { Process, httpFetch, OracleProgram, Bytes, JSON } from '@seda-protocol/as-sdk/assembly';

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
      Process.error(Bytes.fromUtf8String('Error while fetching'));
    }
  }
}

new PlanetProgram().run();
```

## Testing

In order to test this we can use a JS testing suite (we use Bun:test in this repository and the starter kits, but any runner should work). We use the `@seda-protocol/dev-tools` package for this, which runs the Oracle Program in a similar environment as it would on the SEDA network:

```ts
import { executeDrWasm } from '@seda-protocol/dev-tools';
import { readFile } from 'node:fs/promises';

const WASM_PATH = 'build/debug.wasm';

describe('Oracle Program: execution', () => {
  it('should be able to run', async () => {
    const wasmBinary = await readFile(WASM_PATH);

    // Calls our SEDA VM
    const vmResult = await executeDrWasm(
      // The wasm file
      wasmBinary,
      // Inputs for the Oracle Program
      Buffer.from('1'),
    );

    expect(vmResult.exitCode).toBe(0);
    expect(vmResult.resultAsString).toBe('Tatooine');
  });
});
```
