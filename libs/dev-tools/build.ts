import dts from "bun-plugin-dts";

await Bun.build({
	entrypoints: ["./src/index.ts"],
	target: "node",
	outdir: "build",
	external: ["@seda-protocol/vm"],
	plugins: [dts()],
});
