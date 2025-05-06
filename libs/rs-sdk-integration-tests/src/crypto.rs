use seda_sdk_rs::{keccak256, process::Process, secp256k1_verify};

pub fn test_secp256k1_verify_valid() {
    let message = "Hello, SEDA!".as_bytes();
    let signature = hex::decode("58376cc76f4d4959b0adf8070ecf0079db889915a75370f6e39a8451ba5be0c35f091fa4d2fda3ced5b6e6acd1dbb4a45f2c6a1e643622ee4cf8b802b373d38f").unwrap();
    let public_key = hex::decode("02a2bebd272aa28e410cc74cef28e5ce74a9ffc94caf817ed9bd23b01ce2068c7b").unwrap();

    let result = secp256k1_verify(message, &signature, &public_key);

    if result {
        Process::success("valid secp256k1 signature".as_bytes());
    } else {
        Process::error("invalid secp256k1 signature".as_bytes());
    }
}

pub fn test_secp256k1_verify_invalid() {
    let message = "Hello, this is an invalid message!".as_bytes();
    let signature = hex::decode("58376cc76f4d4959b0adf8070ecf0079db889915a75370f6e39a8451ba5be0c35f091fa4d2fda3ced5b6e6acd1dbb4a45f2c6a1e643622ee4cf8b802b373d38f").unwrap();
    let public_key = hex::decode("02a2bebd272aa28e410cc74cef28e5ce74a9ffc94caf817ed9bd23b01ce2068c7b").unwrap();

    let result = secp256k1_verify(message, &signature, &public_key);

    if result {
        Process::success("valid secp256k1 signature".as_bytes());
    } else {
        Process::error("invalid secp256k1 signature".as_bytes());
    }
}

pub fn test_keccak256() {
    let input = Process::get_inputs();
    let result = keccak256(input);

    Process::success(hex::encode(result).as_bytes());
}
