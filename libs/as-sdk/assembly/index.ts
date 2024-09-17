/**
 * The AssemblyScript SDK provides various helpers and utilities for creating Oracle Programs on the SEDA network.
 *
 * @categoryDescription Program
 * Tools to help structure an Oracle Program.
 *
 * @categoryDescription Bytes
 * Functions and classes to help dealing with encoding/decoding of data.
 *
 * @categoryDescription HTTP
 * Functions and classes used to make HTTP requests from an Oracle Program.
 *
 * @categoryDescription Tally
 * Classes to retrieve the execution reports from the overlay nodes.
 *
 * @categoryDescription Crypto
 * Functions to calculate hashes and verify cryptographic signatures.
 *
 * @module @seda-protocol/as-sdk
 */

import Process from "./process";
import Tally from "./tally";

export {
	httpFetch,
	HttpFetchMethod,
	HttpFetchOptions,
	HttpResponse,
} from "./http";

export { proxyHttpFetch } from "./proxy-http";

// Export library so consumers don't need to reimport it themselves
export { JSON } from "json-as/assembly";
export { PromiseStatus } from "./promise";
export { Process, Tally };
export { RevealResult } from "./tally";
export { Console } from "./console";
export { Bytes } from "./bytes";
export { decodeHex, encodeHex } from "./hex";
export { OracleProgram } from "./oracle-program";
export { secp256k1Verify, keccak256 } from "./crypto";
