# AssemblyScript SDK

SDK for creating Data Requests on the SEDA chain

For API documentation please see our docs: https://sedaprotocol.github.io/seda-sdk/

## Example

```ts
import { Process, httpFetch } from "@seda-protocol/as-sdk/assembly";
import { JSON } from "json-as/assembly";

// @ts-expect-error
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

    Process.exit_with_message(0, planet.name);
  } else {
    Process.exit_with_message(1, "Error while fetching");
  }
}

main();
```
