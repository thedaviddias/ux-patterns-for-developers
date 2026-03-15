#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateContentMermaidDiagrams } from "./validate-mermaid-lib.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRelative = (filePath) =>
	path.relative(path.join(__dirname, ".."), filePath);

async function main() {
	console.log("Validating Mermaid diagrams in MDX content...");

	const result = await validateContentMermaidDiagrams();

	if (result.failures.length === 0) {
		console.log(
			`Validated Mermaid diagrams in ${result.filesChecked} MDX files.`,
		);
		return;
	}

	console.error(
		`Found ${result.failures.length} Mermaid error${result.failures.length === 1 ? "" : "s"}:`,
	);

	for (const failure of result.failures) {
		const summary = failure.message.split("\n")[0];
		console.error(
			`- ${repoRelative(failure.filePath)}:${failure.line} ${summary}`,
		);
	}

	process.exitCode = 1;
}

main().catch((error) => {
	console.error("Mermaid validation failed unexpectedly.");
	console.error(error);
	process.exit(1);
});
