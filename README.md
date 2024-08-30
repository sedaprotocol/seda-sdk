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

- [vm](./libs/vm/README.md) - Virtual Machine which can run Data Request WASM binaries
- [as-sdk](./libs/as-sdk/README.md) - [AssemblyScript](https://www.assemblyscript.org/) SDK
- [cli](./libs/cli/README.md) - Command Line Interface for uploading and listing Data Request binaries

# Quick getting started

The easiest way to get started it by using our [starter kit](https://github.com/sedaprotocol/seda-sdk-starter-template) this has all the tools installed that you need:

- AssemblyScript
- SEDA SDK
- SEDA CLI
- SEDA VM
- WASI

In our `assembly/index.ts` we have the following example:

```ts
import { Process, httpFetch, OracleProgram, Bytes } from '@seda-protocol/as-sdk/assembly';
import { JSON } from 'json-as/assembly';

// Our SWAPI JSON schema, since in AssemblyScript we need to define our shape beforehand
// @ts-expect-error
@json
class SwPlanet {
  name!: string;
}

class PlanetProgram extends OracleProgram {
  execution() {
    // HTTP Fetch to the SWAPI
    const response = httpFetch('https://swapi.dev/api/planets/1/');

    // Returns either fulfilled or rejected based on the status code
    const fulfilled = response.fulfilled;

    if (fulfilled !== null) {
      // Converts our buffer to a string
      const data = String.UTF8.decode(fulfilled.bytes.buffer);

      // Parses the JSON to our schema
      const planet = JSON.parse<SwPlanet>(data);

      // Exits the program (with an exit code of 0) and sets the Data Request result to the planet name
      Process.success(Bytes.fromString(planet.name));
    } else {
      Process.error(Bytes.fromString('Error while fetching'));
    }
  }
}

new PlanetProgram().run();
```

And in order to test this we have to use a JS testing suite (In our starting kit we use Jest, but any suite should work). We use the `@seda-protocol/vm` package for this. Which runs the binary in the context of a SEDA Data Request:

```js
import { callVm } from '@seda-protocol/vm';
import { readFile } from 'node:fs/promises';

const WASM_PATH = 'build/debug.wasm';

describe('Oracel Program: execution', () => {
  it('should be able to run', async () => {
    const wasmBinary = await readFile(WASM_PATH);

    // Calls our SEDA VM
    const vmResult = await callVm({
      // Arguments passed to the VM
      args: [],
      // Environment variables passed to the VM
      envs: {},
      // The WASM binary in bytes
      binary: new Uint8Array(wasmBinary),
    });

    expect(vmResult.exitCode).toBe(0);
    expect(vmResult.resultAsString).toBe('Tatooine');
  });
});
```
