#[link(wasm_import_module = "seda_v1")]
extern "C" {
    pub fn execution_result(result: *const u8, result_length: u32);

    // Call actions
    pub fn http_fetch(action: *const u8, action_length: u32) -> u32;
    pub fn proxy_http_fetch(action: *const u8, action_length: u32) -> u32;

    // Reading call actions result
    pub fn call_result_write(result: *const u8, result_length: u32);
    pub fn keccak256(message: *const u8, message_length: u32) -> u32;

    pub fn secp256k1_verify(
        message: *const u8,
        message_length: i64,
        signature: *const u8,
        signature_length: i32,
        public_key: *const u8,
        public_key_length: i32,
    ) -> u8;
}
