import {
  Bytes,
  Process,
  httpFetch,
  OracleProgram,
} from '../../as-sdk/assembly/index';

export class TestTallyVmMode extends OracleProgram {
  execution(): void {
    Process.error(Bytes.fromString('dr'));
  }

  tally(): void {
    Process.success(Bytes.fromString('tally'));
  }
}

export class TestTallyVmHttp extends OracleProgram {
  tally(): void {
    const response = httpFetch('https://swapi.dev/api/planets/1/');
    const fulfilled = response.fulfilled;
    const rejected = response.rejected;

    if (fulfilled !== null) {
      Process.error(
        Bytes.fromString('this should not be allowed in tally mode')
      );
    }

    if (rejected !== null) {
      Process.success(rejected.bytes);
    }
  }
}
