use super::raw;

/// Verifies a secp256k1 ECDSA signature.
///
/// This function verifies that a signature was created by the holder of the private key
/// corresponding to the provided public key, for the given message.
///
/// # Arguments
///
/// * `message` - The message that was signed, as a byte slice
/// * `signature` - The signature to verify, as a byte slice. Must be 64 bytes in DER format
/// * `public_key` - The public key to verify against, as a byte slice. From a SEC1-encoded public key.
///
/// # Returns
///
/// Returns `true` if the signature is valid for the message and public key, `false` otherwise.
///
/// # Examples
///
/// ```no_run
/// use seda_sdk::secp256k1::secp256k1_verify;
///
/// let message = b"Hello, world!";
/// let signature = vec![/* 64 bytes signature */];
/// let public_key = vec![/* 33 or 65 bytes public key */];
///
/// let is_valid = secp256k1_verify(message, &signature, &public_key);
/// if is_valid {
///     println!("Signature is valid!");
/// } else {
///     println!("Signature is invalid!");
/// }
/// ```
pub fn secp256k1_verify(message: &[u8], signature: &[u8], public_key: &[u8]) -> bool {
    let message_len = message.len() as i64;
    let signature_bytes = signature.to_vec();
    let signature_length = signature_bytes.len() as i32;
    let public_key_bytes = public_key.to_vec();
    let public_key_length = public_key_bytes.len() as i32;

    let result_length: u8 = unsafe {
        raw::secp256k1_verify(
            message.as_ptr(),
            message_len,
            signature_bytes.as_ptr(),
            signature_length,
            public_key_bytes.as_ptr(),
            public_key_length,
        )
    };

    let mut result_data_ptr = vec![0; result_length as usize];

    unsafe {
        super::raw::call_result_write(result_data_ptr.as_mut_ptr(), result_length.into());
    }

    match result_data_ptr.first().unwrap_or(&0) {
        0 => false,
        1 => true,
        _ => panic!("Secp256k1 verify returned invalid bool in u8: {result_length}"),
    }
}
