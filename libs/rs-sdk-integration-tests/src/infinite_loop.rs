use seda_sdk_rs::http_fetch;

pub fn test_infinite_loop() {
    let mut num: u128 = 0;

    loop {
        num += 1;

        if num > 1_000 {
            num += 2;
        }
    }
}

pub fn test_infinite_loop_http_fetch() {
    loop {
        let _ = http_fetch("https://fakeresponder.com/?sleep=2400", None);
    }
}
