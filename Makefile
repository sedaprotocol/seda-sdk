# Rust
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

# Golang
.PHONY: build-golang-tests

# -scheduler=none > disables the go keyword and channels
# -panic=trap > traps panics, harder to debug
# -gc=leaking > disables the garbage collector, good for short lived programs
build-go-integration-tests:
	mkdir -p ./dist/libs/go-sdk-integration-tests
	GOOS=wasip1 GOARCH=wasm tinygo build -scheduler=none -panic=trap -gc=leaking -target=wasip1 -o ./dist/libs/go-sdk-integration-tests/integration-tests.wasm ./libs/go-sdk-integration-tests/main.go
	bun wasm-strip ./dist/libs/go-sdk-integration-tests/integration-tests.wasm;
	bun wasm-opt -Oz --enable-bulk-memory ./dist/libs/go-sdk-integration-tests/integration-tests.wasm -o ./dist/libs/go-sdk-integration-tests/integration-tests.wasm;
