import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./test-setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov", "html"],
			exclude: [
				"node_modules/**",
				"test-setup.ts",
				"vitest.config.ts",
				"**/*.d.ts",
				"**/*.config.*",
				"**/mockData/**",
				"**/__mocks__/**",
				"tests/**",
				".generated/**",
				"scripts/**",
				"public/**",
			],
			include: [
				"registry/default/ui/**/*.{ts,tsx}",
				"registry/default/lib/**/*.{ts,tsx}",
			],
			thresholds: {
				branches: 80,
				functions: 80,
				lines: 80,
				statements: 80,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./registry/default"),
		},
	},
});
