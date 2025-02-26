mod crypto;
mod http;
mod infinite_loop;
mod proxy_http;
mod tally;
mod vm_tests;

use crypto::{test_keccak256, test_secp256k1_verify_invalid, test_secp256k1_verify_valid};
use http::{test_http_post_success, test_http_rejection, test_http_success};
use infinite_loop::test_infinite_loop;
use proxy_http::{test_generate_proxy_http_message, test_proxy_http_fetch};
use seda_sdk_rs::{bytes::ToBytes, process::Process};
use tally::{test_tally_vm_reveals, test_tally_vm_reveals_filtered};
use vm_tests::{test_tally_vm_http, test_tally_vm_mode};

fn main() {
    let args = String::from_utf8(Process::get_inputs()).unwrap();

    match args.as_str() {
        "testTallyVmMode" => test_tally_vm_mode(),
        "testTallyVmHttp" => test_tally_vm_http(),
        "testTallyVmReveals" => test_tally_vm_reveals(),
        "testTallyVmRevealsFiltered" => test_tally_vm_reveals_filtered(),
        "testSecp256k1VerifyValid" => test_secp256k1_verify_valid(),
        "testSecp256k1VerifyInvalid" => test_secp256k1_verify_invalid(),
        "testKeccak256" => test_keccak256(),
        "testHttpRejection" => test_http_rejection(),
        "testHttpSuccess" => test_http_success(),
        "testPostHttpSuccess" => test_http_post_success(),
        "testProxyHttpFetch" => test_proxy_http_fetch(),
        "testGenerateProxyMessage" => test_generate_proxy_http_message(),
        "testInfiniteLoop" => test_infinite_loop(),
        _ => Process::error(&"No argument given".to_bytes()),
    }
}
