/// Computes the Keccak-256 hash of a message.
///
/// The Keccak-256 hash function is a cryptographic hash function that produces a 32-byte (256-bit) hash value.
///
/// # Arguments
///
/// * `message` - The input bytes to hash
///
/// # Returns
///
/// A 32-byte vector containing the Keccak-256 hash of the input
///
/// # Examples
///
/// ```
/// use seda_sdk::keccak256::keccak256;
///
/// let message = b"Hello, world!".to_vec();
/// let hash = keccak256(message);
/// assert_eq!(hash.len(), 32);
/// ```
pub fn keccak256(message: Vec<u8>) -> Vec<u8> {
    let result_length = unsafe { super::raw::keccak256(message.as_ptr(), message.len() as u32) };
    let mut result_data_ptr = vec![0; result_length as usize];

    unsafe {
        super::raw::call_result_write(result_data_ptr.as_mut_ptr(), result_length);
    }

    result_data_ptr
}
