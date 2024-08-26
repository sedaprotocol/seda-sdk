import { Console, httpFetch, Process } from '../../as-sdk/assembly/index';
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

Process.exit_with_message(1, "No argument given");

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
  const response = httpFetch('https://jsonplaceholder.typicode.com/todos/1');
  const fulfilled = response.fulfilled;
  const rejected = response.rejected;

  
  if (fulfilled !== null) {
    Process.exit_with_result(0, fulfilled.bytes.value);
  } 

  if (rejected !== null) {
    Process.exit_with_result(1, rejected.bytes.value);
  }
  
  Process.exit_with_message(20, 'Something went wrong..');
}