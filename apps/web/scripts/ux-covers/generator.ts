import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import sharp from "sharp";
import {
	buildCoverPrompt,
	filterPublishedPatternCoverDocs,
	getCoverPromptsFilePath,
	getPatternCoverDocs,
	loadCoverPromptsConfig,
	resolveRequestedPatternDocs,
	saveCoverPromptsConfig,
	seedCoverPromptEntries,
	shouldGenerateCover,
} from "./lib";

const execFileAsync = promisify(execFile);

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

type GeneratorArgs = {
	force: boolean;
	forceAll: boolean;
	pattern: string | null;
	scanOnly: boolean;
};

function parseArgs(argv: string[]): GeneratorArgs {
	const positional = argv.filter((arg) => !arg.startsWith("--"));

	return {
		force: argv.includes("--force"),
		forceAll: argv.includes("--force-all"),
		pattern:
			argv.find((arg) => arg.startsWith("--pattern="))?.split("=")[1] ||
			positional[0] ||
			null,
		scanOnly: argv.includes("--scan-only"),
	};
}

async function renderFallbackCover(slug: string) {
	await execFileAsync("pnpm", [
		"exec",
		"tsx",
		"scripts/render-pattern-art.tsx",
		slug,
	]);
}

async function main() {
	loadEnv();
	const args = parseArgs(process.argv.slice(2));
	const promptsFile = getCoverPromptsFilePath();
	const config = await loadCoverPromptsConfig(promptsFile);
	const allDocs = filterPublishedPatternCoverDocs(await getPatternCoverDocs());
	const selectedDocs = resolveRequestedPatternDocs(args.pattern, allDocs);

	const { changed } = seedCoverPromptEntries(config, selectedDocs);
	if (changed || !existsSync(promptsFile)) {
		await saveCoverPromptsConfig(config, promptsFile);
	}

	if (args.scanOnly) {
		console.log(
			`Synced ${selectedDocs.length} pattern cover prompt entries to ${promptsFile}`,
		);
		return;
	}

	const outDir = path.join(process.cwd(), "public", "covers", "patterns");
	await mkdir(outDir, { recursive: true });
	const docsToGenerate = selectedDocs.filter((doc) => {
		const entry = config.patterns[doc.slug];
		if (!entry) return false;

		return shouldGenerateCover({
			fileExists: existsSync(path.join(outDir, `${doc.slug}.png`)),
			force: args.force,
			forceAll: args.forceAll,
			locked: entry.locked,
		});
	});

	if (docsToGenerate.length === 0) {
		for (const doc of selectedDocs) {
			const entry = config.patterns[doc.slug];
			if (!entry) {
				console.warn(`Skipping ${doc.slug}: missing prompts.json entry.`);
				continue;
			}

			const reason =
				entry.locked && !args.forceAll
					? "Locked in prompts.json (use --force-all to override)"
					: "Asset already exists";
			console.log(`Skipping ${doc.slug}: ${reason}`);
		}
		return;
	}

	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		console.warn(
			"GEMINI_API_KEY is not set. Falling back to the deterministic cover renderer.",
		);

		for (const doc of docsToGenerate) {
			console.log(`Rendering fallback cover for ${doc.fullSlug}...`);
			try {
				await renderFallbackCover(doc.slug);
			} catch (error) {
				console.error(
					`Failed to render fallback cover for ${doc.slug}:`,
					error,
				);
			}
		}
		return;
	}

	const ai = new GoogleGenAI({ apiKey });

	for (const doc of selectedDocs) {
		const entry = config.patterns[doc.slug];
		if (!entry) {
			console.warn(`Skipping ${doc.slug}: missing prompts.json entry.`);
			continue;
		}

		const outFile = path.join(outDir, `${doc.slug}.png`);
		if (
			!shouldGenerateCover({
				fileExists: existsSync(outFile),
				force: args.force,
				forceAll: args.forceAll,
				locked: entry.locked,
			})
		) {
			const reason =
				entry.locked && !args.forceAll
					? "Locked in prompts.json (use --force-all to override)"
					: "Asset already exists";
			console.log(`Skipping ${doc.slug}: ${reason}`);
			continue;
		}

		const prompt = buildCoverPrompt({
			basePrompt: config.basePrompt,
			doc,
			entry,
		});

		console.log(`Generating cover for ${doc.fullSlug}...`);

		try {
			const response = await ai.models.generateContentStream({
				model: "gemini-3.1-flash-image-preview",
				config: {
					thinkingConfig: { thinkingLevel: "MINIMAL" },
					imageConfig: { aspectRatio: "16:9", imageSize: "1K" },
					responseModalities: ["IMAGE"],
				} as any,
				contents: [{ role: "user", parts: [{ text: prompt }] }],
			});

			let imageBuffer: Buffer | null = null;
			for await (const chunk of response) {
				const inlineData = chunk.candidates?.[0]?.content?.parts?.find(
					(part) => {
						return "inlineData" in part && part.inlineData?.data;
					},
				)?.inlineData;

				if (inlineData?.data) {
					imageBuffer = Buffer.from(inlineData.data, "base64");
				}
			}

			if (!imageBuffer) {
				throw new Error("No image data returned from Gemini.");
			}

			const optimizedBuffer = await sharp(imageBuffer)
				.png({ compressionLevel: 9, effort: 8 })
				.toBuffer();
			await writeFile(outFile, optimizedBuffer);
			console.log(`Saved ${outFile}`);
		} catch (error) {
			console.error(`Failed to generate cover for ${doc.slug}:`, error);
		}
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
