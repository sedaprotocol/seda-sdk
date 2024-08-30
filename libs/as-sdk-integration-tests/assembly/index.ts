import { Process, Bytes } from '../../as-sdk/assembly/index';
import { TestHttpRejection, TestHttpSuccess } from './http';
import { testProxyHttpFetch } from './proxy-http';
import { TestTallyVmReveals, TestTallyVmRevealsFiltered } from './tally';
import { TestTallyVmHttp, TestTallyVmMode } from './vm-tests';

const args = String.UTF8.decode(Process.getInputs().buffer);

if (args === 'testHttpRejection') {
  new TestHttpRejection().run();
} else if (args === 'testHttpSuccess') {
  new TestHttpSuccess().run();
} else if (args === 'testTallyVmMode') {
  new TestTallyVmMode().run();
} else if (args === 'testTallyVmHttp') {
  new TestTallyVmHttp().run();
} else if (args === 'testTallyVmReveals') {
  new TestTallyVmReveals().run();
} else if (args === 'testTallyVmRevealsFiltered') {
  new TestTallyVmRevealsFiltered().run();
} else if (args === 'testProxyHttpFetch') {
  testProxyHttpFetch();
}

Process.error(Bytes.fromString('No argument given'));

