# Wasm Integration Tests

This project runs integration tests for the SEDA SDKs in this repository. It requires testing binaries to be built with the SDKs and it will run the tests against the binaries.

Tests are written in TypeScript and run in Bun. We have tests for the shared SDK methods (like `http`, `process`, `proxy_http_fetch`, etc.) and tests for the SDKs themselves, most notably the AS SDK since it implements some abstractions that are missing in the language.

## Running the tests

To run the tests, you need to have a testing binary built with the SDKs. `bun run test` takes care of building the binaries and running the tests. 
