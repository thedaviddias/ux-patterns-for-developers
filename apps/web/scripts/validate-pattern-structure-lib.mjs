import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	TARGET_PATTERN_DOC_CONTRACTS,
	TARGET_PATTERN_DOCS,
} from "./pattern-doc-contract.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.join(__dirname, "..", "..", "..");
const PATTERNS_ROOT = path.join(REPO_ROOT, "apps/web/content/patterns");

function extractSections(source) {
	const headings = [...source.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1]);
	const sections = new Map();
	const matches = [...source.matchAll(/^##\s+(.+)$/gm)];

	for (let index = 0; index < matches.length; index += 1) {
		const current = matches[index];
		const next = matches[index + 1];
		const title = current[1];
		const start = current.index + current[0].length;
		const end = next ? next.index : source.length;
		sections.set(title, source.slice(start, end).trim());
	}

	return { headings, sections };
}

export function validatePatternStructureSource(source, contract) {
	const failures = [];
	const { headings, sections } = extractSections(source);

	if (JSON.stringify(headings) !== JSON.stringify(contract.expectedSections)) {
		failures.push(
			`Section order mismatch. Expected: ${contract.expectedSections.join(" -> ")}. Received: ${headings.join(" -> ")}`,
		);
	}

	for (const component of contract.requiredComponents) {
		if (!source.includes(`<${component}`)) {
			failures.push(`Missing required component <${component}>.`);
		}
	}

	const relatedPatternsSection = sections.get("Related Patterns") || "";
	if (!/<RelatedPatternsCard[\s\S]*patterns=\{\[/m.test(relatedPatternsSection)) {
		failures.push(
			"Related Patterns must use <RelatedPatternsCard patterns={[...]} />.",
		);
	}
	if (/^-\s+\[[^\]]+\]\([^)]+\)/m.test(relatedPatternsSection)) {
		failures.push(
			"Related Patterns must not use markdown bullet links once componentized.",
		);
	}
	if (/category\s*=/m.test(relatedPatternsSection)) {
		failures.push(
			"Related Patterns must use explicit patterns={[...]} data, not category= shortcuts.",
		);
	}

	const faqSection = sections.get("Frequently Asked Questions") || "";
	if (!faqSection.includes("<FaqStructuredData")) {
		failures.push(
			"Frequently Asked Questions must use <FaqStructuredData ... />.",
		);
	}

	if (contract.requiresPlayground) {
		const examplesSection = sections.get("Examples") || "";
		if (!examplesSection.includes("<Playground")) {
			failures.push("Examples must include <Playground ... /> for this pattern.");
		}
	}

	return failures;
}

export async function validatePatternStructureFile(filePath, contract) {
	const source = await fs.readFile(filePath, "utf8");
	return validatePatternStructureSource(source, contract);
}

export async function validatePatternStructures(
	patternsRoot = PATTERNS_ROOT,
	contracts = TARGET_PATTERN_DOC_CONTRACTS,
) {
	const failures = [];

	for (const contract of contracts) {
		const filePath = path.join(patternsRoot, contract.file);
		const fileFailures = await validatePatternStructureFile(filePath, contract);

		for (const message of fileFailures) {
			failures.push({ filePath, message });
		}
	}

	return {
		filesChecked: contracts.length,
		failures,
		targets: TARGET_PATTERN_DOCS,
	};
}
