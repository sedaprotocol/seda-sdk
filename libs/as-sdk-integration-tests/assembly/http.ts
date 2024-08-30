import {
  httpFetch,
  Process,
  Bytes,
  OracleProgram,
} from '../../as-sdk/assembly/index';

export class TestHttpRejection extends OracleProgram {
  execution(): void {
    const response = httpFetch('example.com/');
    const rejected = response.rejected;

    if (rejected !== null) {
      Process.success(Bytes.fromString('rejected'));
    } else {
      Process.error(Bytes.fromString('Test failed'));
    }
  }
}

export class TestHttpSuccess extends OracleProgram {
  execution(): void {
    const response = httpFetch('https://jsonplaceholder.typicode.com/todos/1');
    const fulfilled = response.fulfilled;
    const rejected = response.rejected;

    if (fulfilled !== null) {
      Process.success(fulfilled.bytes);
    }

    if (rejected !== null) {
      Process.error(rejected.bytes);
    }

    Process.error(Bytes.fromString('Something went wrong..'), 20);
  }
}
