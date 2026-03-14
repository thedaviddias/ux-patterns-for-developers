import { existsSync } from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
	buildCoverPrompt,
	filterPublishedPatternCoverDocs,
	getPatternCoverDocs,
	loadCoverPromptsConfig,
	resolveRequestedPatternDocs,
	saveCoverPromptsConfig,
	seedCoverPromptEntries,
} from "./lib";

function loadEnv() {
	const cwd = process.cwd();
	const candidates = [
		path.join(cwd, ".env.local"),
		path.join(cwd, ".env"),
		path.join(cwd, "..", ".env.local"),
		path.join(cwd, "..", ".env"),
	];

	for (const envPath of candidates) {
		if (existsSync(envPath)) {
			dotenv.config({ path: envPath, override: false });
		}
	}
}

function parsePatternArg(argv: string[]) {
	return (
		argv.find((arg) => arg.startsWith("--pattern="))?.split("=")[1] || null
	);
}

function extractJsonObject(text: string) {
	const trimmed = text.trim().replace(/```json\n?|\n?```/g, "");
	const start = trimmed.indexOf("{");
	const end = trimmed.lastIndexOf("}");

	if (start === -1 || end === -1 || end <= start) {
		throw new Error("Optimizer response did not contain a JSON object.");
	}

	return JSON.parse(trimmed.slice(start, end + 1)) as {
		promptAddon?: string;
		subjectPrompt?: string;
	};
}

async function main() {
	loadEnv();
	const targetPattern = parsePatternArg(process.argv.slice(2));
	if (!targetPattern) {
		console.error(
			"Usage: pnpm --filter web exec tsx scripts/ux-covers/optimizer.ts --pattern=<pattern-name>",
		);
		process.exit(1);
	}

	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		console.error(
			"Error: GEMINI_API_KEY environment variable is not set in .env",
		);
		process.exit(1);
	}

	const config = await loadCoverPromptsConfig();
	const docs = filterPublishedPatternCoverDocs(await getPatternCoverDocs());
	seedCoverPromptEntries(config, docs);
	const [doc] = resolveRequestedPatternDocs(targetPattern, docs);

	if (!doc) {
		throw new Error(`No pattern matched "${targetPattern}".`);
	}

	const entry = config.patterns[doc.slug];
	if (!entry) {
		throw new Error(`Missing prompt entry for "${doc.slug}".`);
	}

	const ai = new GoogleGenAI({ apiKey });
	const result = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: [
			{
				role: "user",
				parts: [
					{
						text: `You are an expert prompt engineer for product-style UI image generation.

Rewrite only the pattern-specific parts of a prompt configuration.
- Keep the shared base prompt concept intact.
- Improve specificity, composition, and pattern recognizability.
- Do not add instructions about file formats or command usage.
- Return JSON only with keys "subjectPrompt" and "promptAddon".

Pattern:
- Title: ${doc.title}
- Category: ${doc.categoryLabel}
- Description: ${doc.description || "No description provided."}

Current subjectPrompt:
${entry.subjectPrompt}

Current promptAddon:
${entry.promptAddon || "(empty)"}

Shared base prompt:
${config.basePrompt}

Current final prompt:
${buildCoverPrompt({
	basePrompt: config.basePrompt,
	doc,
	entry,
})}

Return improved JSON in this exact shape:
{
  "subjectPrompt": "string",
  "promptAddon": "string"
}`,
					},
				],
			},
		],
	});

	const responseText =
		typeof result.text === "string" ? result.text.trim() : "";
	const optimized = extractJsonObject(responseText);

	entry.subjectPrompt =
		typeof optimized.subjectPrompt === "string" &&
		optimized.subjectPrompt.trim()
			? optimized.subjectPrompt.trim()
			: entry.subjectPrompt;
	entry.promptAddon =
		typeof optimized.promptAddon === "string"
			? optimized.promptAddon.trim()
			: "";

	await saveCoverPromptsConfig(config);
	console.log(`Updated prompt entry for ${doc.slug}.`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
