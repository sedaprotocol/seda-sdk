import { Bytes, Process } from "../../as-sdk/assembly/index";
import { TestSecp256k1VerifyInvalid, TestSecp256k1VerifyValid } from "./crypto";
import {
	TestHttpRejection,
	TestHttpSuccess,
	TestPostHttpSuccess,
} from "./http";
import { TestProxyHttpFetch } from "./proxy-http";
import { TestTallyVmReveals, TestTallyVmRevealsFiltered } from "./tally";
import { TestTallyVmHttp, TestTallyVmMode } from "./vm-tests";

const args = Process.getInputs().toUtf8String();

if (args === "testHttpRejection") {
	new TestHttpRejection().run();
} else if (args === "testHttpSuccess") {
	new TestHttpSuccess().run();
} else if (args === "testPostHttpSuccess") {
	new TestPostHttpSuccess().run();
} else if (args === "testTallyVmMode") {
	new TestTallyVmMode().run();
} else if (args === "testTallyVmHttp") {
	new TestTallyVmHttp().run();
} else if (args === "testTallyVmReveals") {
	new TestTallyVmReveals().run();
} else if (args === "testTallyVmRevealsFiltered") {
	new TestTallyVmRevealsFiltered().run();
} else if (args === "testProxyHttpFetch") {
	new TestProxyHttpFetch().run();
} else if (args === "testSecp256k1VerifyValid") {
	new TestSecp256k1VerifyValid().run();
} else if (args === "testSecp256k1VerifyInvalid") {
	new TestSecp256k1VerifyInvalid().run();
}

Process.error(Bytes.fromString("No argument given"));
