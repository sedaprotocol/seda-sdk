import { Bytes, Process } from "../../as-sdk/assembly/index";
import {
	TestBigNumberToBytes,
	TestBytesConcat,
	TestBytesHexEncodeDecode,
	TestBytesJSON,
	TestBytesPrefixedHexDecode,
	TestBytesSliceNoArguments,
	TestBytesSliceOnlyStart,
	TestBytesSliceStartEnd,
	TestBytesStaticConcat,
	TestBytesToBigNumber,
	TestBytesToNumber,
	TestNumberToBytes,
} from "./bytes";
import {
	TestLogBuffer,
	TestLogByteArray,
	TestLogFloat,
	TestLogNull,
} from "./console";
import {
	TestKeccak256,
	TestSecp256k1VerifyInvalid,
	TestSecp256k1VerifyValid,
} from "./crypto";
import {
	TestHttpRejection,
	TestHttpSuccess,
	TestPostHttpSuccess,
} from "./http";
import { TestInvalidAttribute } from "./invalid-json";
import { TestMaybeUsage } from "./maybe";
import { TestGenerateProxyMessage, TestProxyHttpFetch } from "./proxy-http";
import { TestResultUsage } from "./result";
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
} else if (args === "testGenerateProxyMessage") {
	new TestGenerateProxyMessage().run();
} else if (args === "testSecp256k1VerifyValid") {
	new TestSecp256k1VerifyValid().run();
} else if (args === "testSecp256k1VerifyInvalid") {
	new TestSecp256k1VerifyInvalid().run();
} else if (args === "testKeccak256") {
	new TestKeccak256().run();
} else if (args === "testLogBuffer") {
	new TestLogBuffer().run();
} else if (args === "testLogByteArray") {
	new TestLogByteArray().run();
} else if (args === "testBytesSliceNoArguments") {
	new TestBytesSliceNoArguments().run();
} else if (args === "testBytesSliceOnlyStart") {
	new TestBytesSliceOnlyStart().run();
} else if (args === "testBytesSliceStartEnd") {
	new TestBytesSliceStartEnd().run();
} else if (args.startsWith("testBytesConcat")) {
	new TestBytesConcat().run();
} else if (args.startsWith("testBytesStaticConcat")) {
	new TestBytesStaticConcat().run();
} else if (args === "testBytesHexEncodeDecode") {
	new TestBytesHexEncodeDecode().run();
} else if (args === "testBytesPrefixedHexDecode") {
	new TestBytesPrefixedHexDecode().run();
} else if (args.startsWith("testBytesJSON")) {
	new TestBytesJSON().run();
} else if (args === "testBytesToNumber") {
	new TestBytesToNumber().run();
} else if (args === "testNumberToBytes") {
	new TestNumberToBytes().run();
} else if (args === "testBytesToBigNumber") {
	new TestBytesToBigNumber().run();
} else if (args === "testBigNumberToBytes") {
	new TestBigNumberToBytes().run();
} else if (args === "testLogNull") {
	new TestLogNull().run();
} else if (args === "testLogFloat") {
	new TestLogFloat().run();
} else if (args === "testInvalidAttribute") {
	new TestInvalidAttribute().run();
} else if (args === "testResultUsage") {
	new TestResultUsage().run();
} else if (args === "testMaybeUsage") {
	new TestMaybeUsage().run();
}

Process.error(Bytes.fromUtf8String("No argument given"));
