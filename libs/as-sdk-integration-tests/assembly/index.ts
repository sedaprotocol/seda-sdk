import { httpFetch, Process } from '../../as-sdk/assembly/index';
import { testTallyVmHttp, testTallyVmMode } from './vm-tests';

const args = Process.args().at(1);

if (args === 'testHttpRejection') {
  testHttpRejection();
} else if (args === 'testHttpSuccess') {
  testHttpSuccess();
} else if (args === 'testTallyVmMode') {
  testTallyVmMode();
} else if (args === 'testTallyVmHttp') {
  testTallyVmHttp();
}

export function testHttpRejection(): void {
  const response = httpFetch('example.com/');
  const rejected = response.rejected;

  if (rejected !== null) {
    const msg = String.UTF8.encode('rejected');
    const buffer = Uint8Array.wrap(msg);

    Process.exit_with_result(0, buffer);
  } else {
    Process.exit_with_message(1, 'Test failed');
  }
}

export function testHttpSuccess(): void {
  const response = httpFetch('http://example.com/');
  const fulfilled = response.fulfilled;

  if (fulfilled !== null) {
    const msg = String.UTF8.encode('ok');
    const buffer = Uint8Array.wrap(msg);

    Process.exit_with_result(0, buffer);
  } else {
    Process.exit_with_message(31, 'My custom test failed');
  }
}
