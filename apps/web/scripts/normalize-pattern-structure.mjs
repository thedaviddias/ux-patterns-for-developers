#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TARGET_PATTERN_DOC_CONTRACTS } from "./pattern-doc-contract.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATTERNS_ROOT = path.join(__dirname, "..", "content", "patterns");

function parseSections(source) {
	const firstHeading = source.search(/^##\s+/m);
	const preamble =
		firstHeading === -1
			? source.trimEnd()
			: source.slice(0, firstHeading).trimEnd();
	const matches = [...source.matchAll(/^##\s+(.+)$/gm)];
	const sections = new Map();

	for (let index = 0; index < matches.length; index += 1) {
		const current = matches[index];
		const next = matches[index + 1];
		const title = current[1];
		const start = current.index + current[0].length;
		const end = next ? next.index : source.length;
		sections.set(title, source.slice(start, end).trim());
	}

	return { preamble, sections };
}

function renderRelatedPatterns(relatedPatterns) {
	const lines = ["<RelatedPatternsCard", "  patterns={["];

	for (const item of relatedPatterns) {
		lines.push("    {");
		lines.push(`      title: ${JSON.stringify(item.title)},`);
		lines.push(`      path: ${JSON.stringify(item.path)},`);
		lines.push(`      description: ${JSON.stringify(item.description)},`);
		lines.push("    },");
	}

	lines.push("  ]}");
	lines.push("/>");

	return lines.join("\n");
}

function normalizeSource(source, contract) {
	const { preamble, sections } = parseSections(source);
	const output = [preamble];

	for (const title of contract.expectedSections) {
		let body = sections.get(title) ?? "";

		if (title === "Related Patterns") {
			body = renderRelatedPatterns(contract.relatedPatterns);
		}

		output.push(`## ${title}\n\n${body}`.trimEnd());
	}

	return `${output.join("\n\n")}\n`;
}

async function main() {
	let changed = 0;

	for (const contract of TARGET_PATTERN_DOC_CONTRACTS) {
		const filePath = path.join(PATTERNS_ROOT, contract.file);
		const source = await fs.readFile(filePath, "utf8");
		const normalized = normalizeSource(source, contract);

		if (normalized !== source) {
			await fs.writeFile(filePath, normalized);
			changed += 1;
		}
	}

	console.log(
		`Normalized ${changed} pattern docs using the structure contract.`,
	);
}

main().catch((error) => {
	console.error("Pattern structure normalization failed.");
	console.error(error);
	process.exit(1);
});
