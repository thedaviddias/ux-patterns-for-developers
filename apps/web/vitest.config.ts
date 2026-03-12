import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(rootDir),
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		include: ["**/*.{test,spec}.{ts,tsx}"],
		setupFiles: ["./test-setup.ts"],
	},
});
