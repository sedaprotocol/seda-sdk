export declare function http_fetch(
  action_ptr: usize,
  action_length: u32
): u32;

export declare function proxy_http_fetch(
  action_ptr: usize,
  action_length: u32
): u32;

export declare function call_result_write(
  result: usize,
  result_length: u32
): void;

export declare function execution_result(result: usize, result_length: u32): void;
