import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_ROOT = path.join(__dirname, "../content");
const MDX_EXTENSION = ".mdx";
const MERMAID_FENCE_REGEX = /```mermaid\r?\n([\s\S]*?)```/g;
const ERROR_LINE_REGEX = /line\s+(\d+)/i;
const require = createRequire(import.meta.url);

let mermaidPromise;

async function getMermaid() {
	if (!mermaidPromise) {
		mermaidPromise = (async () => {
			const mermaidPackagePath = require.resolve("mermaid/package.json");
			const domPurifyCjsPath = require.resolve("dompurify", {
				paths: [path.dirname(mermaidPackagePath)],
			});
			const domPurifyEsmPath = path.join(
				path.dirname(domPurifyCjsPath),
				"purify.es.mjs",
			);
			const domPurifyModule = await import(domPurifyEsmPath);

			// Mermaid's Node import receives the DOMPurify factory, not an initialized browser instance.
			domPurifyModule.default.addHook = () => {};
			domPurifyModule.default.sanitize = (value) => value;

			const { default: mermaid } = await import("mermaid");
			mermaid.initialize({
				startOnLoad: false,
				securityLevel: "loose",
			});
			return mermaid;
		})();
	}

	return mermaidPromise;
}

export function extractMermaidBlocks(source) {
	const blocks = [];

	for (const match of source.matchAll(MERMAID_FENCE_REGEX)) {
		const [fullMatch, chart] = match;
		const openingFenceLine = source.slice(0, match.index).split("\n").length;
		blocks.push({
			chart,
			startLine: openingFenceLine + 1,
			raw: fullMatch,
		});
	}

	return blocks;
}

async function walkMdxFiles(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				return walkMdxFiles(fullPath);
			}

			if (entry.isFile() && entry.name.endsWith(MDX_EXTENSION)) {
				return [fullPath];
			}

			return [];
		}),
	);

	return files.flat();
}

function getErrorLineNumber(error) {
	const message = error instanceof Error ? error.message : String(error);
	const match = message.match(ERROR_LINE_REGEX);
	return match ? Number.parseInt(match[1], 10) : null;
}

export async function validateMermaidBlocksInSource(source, filePath) {
	const blocks = extractMermaidBlocks(source);
	const failures = [];
	const mermaid = await getMermaid();

	for (const block of blocks) {
		try {
			await mermaid.parse(block.chart);
		} catch (error) {
			const chartLine = getErrorLineNumber(error);
			failures.push({
				filePath,
				line: chartLine ? block.startLine + chartLine - 1 : block.startLine,
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}

	return failures;
}

export async function validateMermaidFile(filePath) {
	const source = await fs.readFile(filePath, "utf8");
	return validateMermaidBlocksInSource(source, filePath);
}

export async function validateContentMermaidDiagrams(contentRoot = CONTENT_ROOT) {
	const files = await walkMdxFiles(contentRoot);
	const failures = [];

	for (const filePath of files) {
		failures.push(...(await validateMermaidFile(filePath)));
	}

	return {
		filesChecked: files.length,
		failures,
	};
}
