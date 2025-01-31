.PHONY: build-integration-tests check clean fmt

clean:
	cargo clean

fmt:
	cargo fmt --all

fmt-check:
	cargo fmt --all -- --check

check:
	cargo clippy --all-features --locked -- -D warnings

build-integration-tests:
	cargo build -p rs-sdk-integration-tests --target wasm32-wasip1 --profile release-wasm
	bun wasm-strip target/wasm32-wasip1/release-wasm/rs-sdk-integration-tests.wasm;
	bun wasm-opt -Oz --enable-bulk-memory target/wasm32-wasip1/release-wasm/rs-sdk-integration-tests.wasm -o target/wasm32-wasip1/release-wasm/rs-sdk-integration-tests.wasm;

install-tools:
	bun install
