# AssemblyScript SDK

SDK for creating Oracle Programs on the SEDA chain

For API documentation please see our docs: https://sedaprotocol.github.io/seda-sdk/

## Example

```ts
import { Process, httpFetch, Bytes } from "@seda-protocol/as-sdk/assembly";
import { JSON } from "json-as/assembly";

@json
class SwPlanet {
  name!: string
}

function main(): void {
  const response = httpFetch("https://swapi.dev/api/planets/1/");
  const fulfilled = response.fulfilled;

  if (fulfilled !== null) {
    const data = String.UTF8.decode(fulfilled.bytes.buffer);
    const planet = JSON.parse<SwPlanet>(data);

    Process.success(Bytes.fromString(planet.name));
  } else {
    Process.error(Bytes.fromString("Error while fetching"));
  }
}

main();
```
