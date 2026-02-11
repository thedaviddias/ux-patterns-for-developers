import { defineConfig } from "tsup"

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/cli.ts",
		"src/tools/index.ts",
		"src/utils/index.ts",
		"src/data/index.ts",
	],
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	target: "node20",
	outDir: "dist",
})
