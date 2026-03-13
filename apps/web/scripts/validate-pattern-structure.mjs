#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { validatePatternStructures } from "./validate-pattern-structure-lib.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRelative = (filePath) =>
	path.relative(path.join(__dirname, ".."), filePath);

async function main() {
	console.log("Validating generated pattern structure...");

	const result = await validatePatternStructures();

	if (result.failures.length === 0) {
		console.log(
			`Validated structure for ${result.filesChecked} generated pattern docs.`,
		);
		return;
	}

	console.error(
		`Found ${result.failures.length} pattern structure error${result.failures.length === 1 ? "" : "s"}:`,
	);

	for (const failure of result.failures) {
		console.error(`- ${repoRelative(failure.filePath)} ${failure.message}`);
	}

	process.exitCode = 1;
}

main().catch((error) => {
	console.error("Pattern structure validation failed unexpectedly.");
	console.error(error);
	process.exit(1);
});
