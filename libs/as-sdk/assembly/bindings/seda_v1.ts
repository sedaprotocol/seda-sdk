export declare function http_fetch(action_ptr: usize, action_length: u32): u32;

export declare function proxy_http_fetch(
	action_ptr: usize,
	action_length: u32,
): u32;

export declare function call_result_write(
	result: usize,
	result_length: u32,
): void;

export declare function execution_result(
	result: usize,
	result_length: u32,
): void;

export declare function secp256k1_verify(
	message: usize,
	message_length: u64,
	signature: usize,
	signature_length: u32,
	public_key: usize,
	public_key_length: u32,
): u8;

export declare function keccak256(message: usize, message_length: u32): u32;
