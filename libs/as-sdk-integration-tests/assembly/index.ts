import { httpFetch, Process, Bytes } from '../../as-sdk/assembly/index';
import { testProxyHttpFetch } from './proxy-http';
import { testTallyVmReveals, testTallyVmRevealsFiltered } from './tally';
import { testTallyVmHttp, testTallyVmMode } from './vm-tests';

const args = String.UTF8.decode(Process.getInputs().buffer);

if (args === 'testHttpRejection') {
  testHttpRejection();
} else if (args === 'testHttpSuccess') {
  testHttpSuccess();
} else if (args === 'testTallyVmMode') {
  testTallyVmMode();
} else if (args === 'testTallyVmHttp') {
  testTallyVmHttp();
} else if (args === 'testTallyVmReveals') {
  testTallyVmReveals();
} else if (args === 'testTallyVmRevealsFiltered') {
  testTallyVmRevealsFiltered();
} else if (args === 'testProxyHttpFetch') {
  testProxyHttpFetch();
}

Process.error(Bytes.fromString("No argument given"));

function testHttpRejection(): void {
  const response = httpFetch('example.com/');
  const rejected = response.rejected;

  if (rejected !== null) {
    Process.success(Bytes.fromString('rejected'));
  } else {
    Process.error(Bytes.fromString('Test failed'));
  }
}

function testHttpSuccess(): void {
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
