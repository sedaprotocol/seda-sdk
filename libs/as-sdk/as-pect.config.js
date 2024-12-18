export default {
	/**
	 * A set of globs passed to the glob package that qualify typescript files for testing.
	 */
	entries: ["./assembly/__test__/**/*.spec.ts"],
	/**
	 * A set of globs passed to the glob package that quality files to be added to each test.
	 */
	include: ["./assembly/__test__/**/*.include.ts"],
	/**
	 * A set of regexp that will exclude source files from testing.
	 */
	disclude: [/node_modules/],
	/**
	 * Add your required AssemblyScript imports here.
	 */
	async instantiate(memory, createImports, instantiate, binary) {
		// biome-ignore lint/style/useConst: Imports can reference this
		let instance;
		const myImports = {
			seda_v1: { memory },
			// put your web assembly imports here, and return the module promise
		};
		instance = instantiate(binary, createImports(myImports));
		return instance;
	},
	/** Enable code coverage. */
	// coverage: ["assembly/**/*.ts"],
	/**
	 * Specify if the binary wasm file should be written to the file system.
	 */
	outputBinary: false,
};
