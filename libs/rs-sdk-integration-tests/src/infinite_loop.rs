pub fn test_infinite_loop() {
    let mut num: u128 = 0;

    loop {
        num += 1;

        if num > 1_000 {
            num += 2;
        }
    }
}
