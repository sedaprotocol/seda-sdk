import { Bytes, Process, httpFetch } from '../../as-sdk/assembly/index';

export function testTallyVmMode(): void {
  if (Process.isTallyVmMode()) {
    Process.success(Bytes.fromString('tally'));
  } else if (Process.isDrVmMode()) {
    Process.error(Bytes.fromString('dr'));
  }

  throw new Error(`Unknown VM mode: ${Process.getVmMode()}`);
}

export function testTallyVmHttp(): void {
  const response = httpFetch('https://swapi.dev/api/planets/1/');
  const fulfilled = response.fulfilled;
  const rejected = response.rejected;

  if (fulfilled !== null) {
    Process.error(Bytes.fromString('this should not be allowed in tally mode'));
  }

  if (rejected !== null) {
    Process.success(rejected.bytes);
  }
}
