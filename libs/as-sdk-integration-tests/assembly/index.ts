import { httpFetch, Process } from '../../as-sdk/assembly/index';
const args = Process.args()[0];

if (args === 'testHttpRejection') {
  testHttpRejection();
} else if (args === 'testHttpSuccess') {
  testHttpSuccess();
}

export function testHttpRejection(): void {
  const response = httpFetch('example.com/');
  const rejected = response.rejected;

  if (rejected !== null) {
    const msg = String.UTF8.encode('rejected');
    const buffer = Uint8Array.wrap(msg);

    Process.exit_with_result(0, buffer);
  }
}

export function testHttpSuccess(): void {
  const response = httpFetch('http://example.com/');
  const fulfilled = response.fulfilled;

  if (fulfilled !== null) {
    const msg = String.UTF8.encode('ok');
    const buffer = Uint8Array.wrap(msg);

    Process.exit_with_result(0, buffer);
  }
}


