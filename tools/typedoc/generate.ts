import path from "node:path";
import TypeDoc from "typedoc";

const FAVICON_FILE_NAME = "favicon.ico";

async function main() {
	const app = await TypeDoc.Application.bootstrap({
		entryPoints: ["libs/as-sdk/assembly/index.ts"],
		tsconfig: "./libs/as-sdk/assembly/tsconfig.json",
		skipErrorChecking: true,
		githubPages: true,
		gitRevision: "main",
		includeVersion: true,
		visibilityFilters: {},
		exclude: ["**/node_modules/**"],
		navigation: {
			includeCategories: true,
		},
		categoryOrder: ["Program", "Bytes", "HTTP", "Tally", "Other"],
		navigationLinks: {
			GitHub: "https://github.com/sedaprotocol/seda-sdk",
			SEDA: "https://seda.xyz",
		},
	});

	const project = await app.convert();

	if (!project) {
		throw new Error("Failed to convert app");
	}

	const outputDir = "docs";
	await app.generateDocs(project, outputDir);

	const iconPath = path.resolve(import.meta.dir, FAVICON_FILE_NAME);
	const iconFile = Bun.file(iconPath);
	await Bun.write(path.resolve(outputDir, FAVICON_FILE_NAME), iconFile);
}

main().catch(console.error);
