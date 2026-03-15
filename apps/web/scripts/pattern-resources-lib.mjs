import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	getResourceProfile,
	NON_PATTERN_RESOURCE_EXCLUSIONS,
	OPTIONAL_RESOURCE_SECTION_ORDER,
	RESOURCE_MINIMUMS,
	RESOURCE_SECTION_ORDER,
} from "./pattern-resources-config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const WEB_ROOT = path.join(__dirname, "..");
export const PATTERNS_ROOT = path.join(WEB_ROOT, "content", "patterns");

function parseTopLevelSections(source) {
	const firstHeading = source.search(/^##\s+/m);
	const preamble =
		firstHeading === -1
			? source.trimEnd()
			: source.slice(0, firstHeading).trimEnd();
	const matches = [...source.matchAll(/^##\s+(.+)$/gm)];
	const sections = [];

	for (let index = 0; index < matches.length; index += 1) {
		const current = matches[index];
		const next = matches[index + 1];
		const title = current[1];
		const start = current.index + current[0].length;
		const end = next ? next.index : source.length;
		sections.push({
			title,
			body: source.slice(start, end).trim(),
		});
	}

	return { preamble, sections };
}

function buildMarkdownList(items) {
	return items.map(
		(item) => `- [${item.title}](${item.url}) - ${item.description}`,
	);
}

export function renderResources(relativeFile) {
	const profile = getResourceProfile(relativeFile);
	const lines = ["## Resources", ""];

	for (const heading of RESOURCE_SECTION_ORDER) {
		const key =
			heading === "NPM Packages" ? "npmPackages" : heading.toLowerCase();
		const items = profile[key] ?? [];
		lines.push(`### ${heading}`);
		lines.push("");
		lines.push(...buildMarkdownList(items));
		lines.push("");
	}

	return `${lines.join("\n").trim()}\n`;
}

export function syncResourceSectionSource(source, relativeFile) {
	const renderedResources = renderResources(relativeFile).trim();
	const { preamble, sections } = parseTopLevelSections(source);
	const output = [];

	if (preamble) {
		output.push(preamble);
	}

	for (const section of sections) {
		if (section.title === "Resources") {
			continue;
		}
		output.push(`## ${section.title}\n\n${section.body}`.trimEnd());
	}

	output.push(renderedResources);

	return `${output.join("\n\n").trim()}\n`;
}

function parseResourceSubsections(sectionBody) {
	const matches = [...sectionBody.matchAll(/^###\s+(.+)$/gm)];
	const subsections = [];

	for (let index = 0; index < matches.length; index += 1) {
		const current = matches[index];
		const next = matches[index + 1];
		const title = current[1];
		const start = current.index + current[0].length;
		const end = next ? next.index : sectionBody.length;
		subsections.push({
			title,
			body: sectionBody.slice(start, end).trim(),
		});
	}

	return subsections;
}

function countExternalLinks(text) {
	return (text.match(/\[[^\]]+\]\((https:\/\/[^)]+)\)/g) ?? []).length;
}

export function extractExternalResourceUrls(source) {
	const { sections } = parseTopLevelSections(source);
	const resources = sections.find((section) => section.title === "Resources");

	if (!resources) {
		return [];
	}

	return [...resources.body.matchAll(/\[[^\]]+\]\((https:\/\/[^)]+)\)/g)].map(
		(match) => match[1],
	);
}

export function extractNpmPackageNames(source) {
	const { sections } = parseTopLevelSections(source);
	const resources = sections.find((section) => section.title === "Resources");

	if (!resources) {
		return [];
	}

	const subsections = parseResourceSubsections(resources.body);
	const npmSection = subsections.find(
		(section) => section.title === "NPM Packages",
	);

	if (!npmSection) {
		return [];
	}

	const names = [];

	for (const match of npmSection.body.matchAll(
		/\[[^\]]+\]\(https:\/\/www\.npmjs\.com\/package\/([^)]+)\)/g,
	)) {
		names.push(decodeURIComponent(match[1]));
	}

	return [...new Set(names)];
}

export function validatePatternResourcesSource(
	source,
	relativeFile = "unknown",
) {
	const failures = [];
	const { sections } = parseTopLevelSections(source);

	if (sections.length === 0) {
		failures.push("Document does not contain any `##` sections.");
		return failures;
	}

	if (sections.at(-1)?.title !== "Resources") {
		failures.push("`Resources` must be the final top-level section.");
	}

	const resources = sections.find((section) => section.title === "Resources");

	if (!resources) {
		failures.push("Missing required `Resources` section.");
		return failures;
	}

	const subsections = parseResourceSubsections(resources.body);
	const titles = subsections.map((section) => section.title);

	for (let index = 0; index < RESOURCE_SECTION_ORDER.length; index += 1) {
		const expected = RESOURCE_SECTION_ORDER[index];
		const actual = titles[index];

		if (actual !== expected) {
			failures.push(
				`Required resource subsection order mismatch in ${relativeFile}. Expected \`${expected}\` at position ${index + 1}.`,
			);
		}
	}

	for (const title of titles.slice(RESOURCE_SECTION_ORDER.length)) {
		if (!OPTIONAL_RESOURCE_SECTION_ORDER.includes(title)) {
			failures.push(
				`Unexpected resource subsection \`${title}\` in ${relativeFile}.`,
			);
		}
	}

	const resourceLinkMatches = [
		...resources.body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g),
	];

	for (const match of resourceLinkMatches) {
		if (!match[1].startsWith("https://")) {
			failures.push(
				`Resources must only contain external https links. Found \`${match[1]}\` in ${relativeFile}.`,
			);
		}
	}

	let totalExternalLinks = 0;

	for (const heading of RESOURCE_SECTION_ORDER) {
		const key =
			heading === "NPM Packages" ? "npmPackages" : heading.toLowerCase();
		const subsection = subsections.find((section) => section.title === heading);

		if (!subsection) {
			continue;
		}

		const externalLinks = countExternalLinks(subsection.body);
		totalExternalLinks += externalLinks;
		const minimum = RESOURCE_MINIMUMS[key];

		if (externalLinks < minimum) {
			failures.push(
				`\`${heading}\` in ${relativeFile} must contain at least ${minimum} external links.`,
			);
		}

		if (heading === "NPM Packages") {
			for (const match of subsection.body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
				if (!match[1].startsWith("https://www.npmjs.com/package/")) {
					failures.push(
						"`NPM Packages` links must point to npm package pages.",
					);
				}
			}
		}
	}

	if (totalExternalLinks < RESOURCE_MINIMUMS.total) {
		failures.push(
			`Resources in ${relativeFile} must contain at least ${RESOURCE_MINIMUMS.total} external links in total.`,
		);
	}

	return failures;
}

export async function getPublishedPatternFiles(patternsRoot = PATTERNS_ROOT) {
	const categoryEntries = await fs.readdir(patternsRoot, {
		withFileTypes: true,
	});
	const files = [];

	for (const entry of categoryEntries) {
		if (!entry.isDirectory()) {
			continue;
		}

		const categoryDir = path.join(patternsRoot, entry.name);
		const childEntries = await fs.readdir(categoryDir, { withFileTypes: true });

		for (const child of childEntries) {
			if (!child.isFile() || !child.name.endsWith(".mdx")) {
				continue;
			}

			const relativeFile = path.join(entry.name, child.name);

			if (NON_PATTERN_RESOURCE_EXCLUSIONS.has(relativeFile)) {
				continue;
			}

			files.push(relativeFile);
		}
	}

	return files.sort();
}

export async function syncPatternResourceFiles(patternsRoot = PATTERNS_ROOT) {
	const files = await getPublishedPatternFiles(patternsRoot);
	let changed = 0;

	for (const relativeFile of files) {
		const fullPath = path.join(patternsRoot, relativeFile);
		const source = await fs.readFile(fullPath, "utf8");
		const nextSource = syncResourceSectionSource(source, relativeFile);

		if (nextSource !== source) {
			await fs.writeFile(fullPath, nextSource);
			changed += 1;
		}
	}

	return { files, changed };
}

export async function validatePatternResourceFiles(
	patternsRoot = PATTERNS_ROOT,
) {
	const files = await getPublishedPatternFiles(patternsRoot);
	const failures = [];

	for (const relativeFile of files) {
		const fullPath = path.join(patternsRoot, relativeFile);
		const source = await fs.readFile(fullPath, "utf8");
		const fileFailures = validatePatternResourcesSource(source, relativeFile);

		for (const message of fileFailures) {
			failures.push({ relativeFile, fullPath, message });
		}
	}

	return { filesChecked: files.length, failures };
}

export async function writeExternalResourcesTempFile(
	patternsRoot = PATTERNS_ROOT,
) {
	const files = await getPublishedPatternFiles(patternsRoot);
	const urls = new Set();

	for (const relativeFile of files) {
		const fullPath = path.join(patternsRoot, relativeFile);
		const source = await fs.readFile(fullPath, "utf8");

		for (const url of extractExternalResourceUrls(source)) {
			urls.add(url);
		}
	}

	const tempFile = path.join(
		os.tmpdir(),
		`pattern-resources-${Date.now()}-${process.pid}.md`,
	);
	const lines = [...urls].sort().map((url) => `- ${url}`);
	await fs.writeFile(tempFile, `${lines.join("\n")}\n`);

	return { tempFile, urls: [...urls].sort() };
}
