# AssemblyScript SDK

SDK for creating Oracle Programs on the SEDA chain.

For guides an examples on how to use this SDK see our documentation: <LINK_HERE>

## Preview

```ts
import { Process, httpFetch, Bytes, OracleProgram, Console, JSON } from "@seda-protocol/as-sdk/assembly";

@json
class SwPlanet {
  name!: string;
}

class PlanetProgram extends OracleProgram {
  execute(): void {
    const response = httpFetch("https://swapi.dev/api/planets/1/");

    if (response.isFulfilled()) {
      const planet = JSON.parse<SwPlanet>(response.unwrap().toUtf8String());

      Console.log(planet);

      Process.success(Bytes.fromUtf8String(planet.name));
    } else {
      Process.error(Bytes.fromUtf8String("Error while fetching"));
    }
  }
}

new PlanetProgram().run();
```
