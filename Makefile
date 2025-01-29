.PHONY: build-example check clean fmt

clean:
	cargo clean

fmt:
	cargo +nightly fmt --all

fmt-check:
	cargo +nightly fmt --all -- --check

check:
	cargo clippy --all-features --locked -- -D warnings

build-example:
	cargo build -p example --target wasm32-wasip1 --profile release-wasm
	wasm-strip target/wasm32-wasip1/release-wasm/example.wasm;
	wasm-opt -Oz --enable-bulk-memory target/wasm32-wasip1/release-wasm/example.wasm -o target/wasm32-wasip1/release-wasm/example.wasm;

install-tools:
	npm install -g binaryen wabt