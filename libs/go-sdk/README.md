# Go SDK

> [!CAUTION]
> This SDK is currently a proof of concept maintained out of interest and is not officially supported. Please use the [Rust SDK](../rs-sdk) for production use.

SDK for creating SEDA Oracle Programs in Go.

## Compiling Oracle Programs

You can compile your Oracle Program to WebAssembly using the `tinygo` compiler. Make sure to set the target to `wasip1`. The following command should work for most cases and produce WASM files that are optimized for small size.

```bash
GOOS=wasip1 GOARCH=wasm -scheduler=none -panic=trap -gc=leaking tinygo build -target=wasip1 -o ./oracle-program.wasm ./main.go
```

The flags used are:
- `-scheduler=none` - Disables the Go scheduler and channels.
- `-panic=trap` - Traps panics. Produces smaller binaries but makes programs harder to debug.
- `-gc=leaking` - Disables the garbage collector, good for short lived programs like Oracle Programs.

See the [tinygo docs](https://tinygo.org/docs/reference/usage/important-options/) for more information on the flags and other optimizations that are available.

## Example

Below is an example of an Oracle Program that retrieves the name of a planet in the SWAPI database.

```go
// TODO: psych!
```

- [ ] Add OracleProgram struct/interface/trait/whatever
- [ ] Add example
