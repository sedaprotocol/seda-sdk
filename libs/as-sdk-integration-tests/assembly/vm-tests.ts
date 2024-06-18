import { Process, httpFetch } from "../../as-sdk/assembly/index";

export function testTallyVmMode(): void {
  if (Process.isTallyVmMode()) {
    Process.exit_with_message(0, "tally");
  } else if (Process.isDrVmMode()) {
    Process.exit_with_message(1, "dr");
  }

  throw new Error(`Unknown VM mode: ${Process.getVmMode()}`);
}

export function testTallyVmHttp(): void {
  const response = httpFetch("https://swapi.dev/api/planets/1/");
  const fulfilled = response.fulfilled;
  const rejected = response.rejected;

  if (fulfilled !== null) {
    Process.exit_with_message(1, "this should not be allowed in tally mode");
  }

  if (rejected !== null) {
    Process.exit_with_result(0, rejected.bytes);
  }
}
