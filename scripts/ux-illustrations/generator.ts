import "dotenv/config";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { glob } from "glob";
import sharp from "sharp";

async function main() {
	const args = process.argv.slice(2);
	const isDryRun = args.includes("--dry-run");
	const isForce = args.includes("--force");
	const isForceAll = args.includes("--force-all");
	const isScanOnly = args.includes("--scan-only");
	const targetPatternArg = args.find((arg) => arg.startsWith("--pattern="));
	const targetPattern = targetPatternArg
		? targetPatternArg.split("=")[1]
		: null;
	const targetPairArg = args.find((arg) => arg.startsWith("--pair="));
	const targetPair = targetPairArg ? targetPairArg.split("=")[1] : null;
	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey && !isScanOnly) {
		console.error(
			"Error: GEMINI_API_KEY environment variable is not set in .env",
		);
		process.exit(1);
	}

	const ai = isScanOnly
		? null
		: new GoogleGenAI({
				apiKey,
			});

	const config = {
		thinkingConfig: { thinkingLevel: "MINIMAL" },
		imageConfig: { aspectRatio: "16:9", imageSize: "1K" },
		responseModalities: ["IMAGE"],
	};
	const model = "gemini-3.1-flash-image-preview";

	const promptsFile = path.join(
		process.cwd(),
		"scripts",
		"ux-illustrations",
		"prompts.json",
	);
	let promptsConfig: Record<string, any> = {};
	if (existsSync(promptsFile)) {
		try {
			promptsConfig = JSON.parse(await readFile(promptsFile, "utf8"));
		} catch (_e) {
			console.warn("Could not parse prompts.json. Starting fresh.");
		}
	}

	const patternFiles = await glob("apps/web/content/patterns/**/*.mdx");

	for (const file of patternFiles) {
		const patternNameMatch = file.match(/patterns\/(.*?)\.mdx$/);
		if (!patternNameMatch) continue;

		const patternName = path.basename(file, ".mdx");
		if (targetPattern && patternName !== targetPattern) continue;

		console.log(`\nProcessing: ${patternName}`);
		if (!promptsConfig[patternName]) promptsConfig[patternName] = {};

		// Migration: Rename old keys (e.g., "content-1") to new keys (e.g., "do-dont-content-1")
		for (const key of Object.keys(promptsConfig[patternName])) {
			if (!key.startsWith("do-dont-")) {
				promptsConfig[patternName][`do-dont-${key}`] =
					promptsConfig[patternName][key];
				delete promptsConfig[patternName][key];
			}
		}

		const content = await readFile(file, "utf8");
		const bestPracticesMatch = content.match(
			/## Best Practices\n([\s\S]*?)(?=\n## |$)/,
		);
		if (!bestPracticesMatch) continue;

		const bestPracticesFullText = bestPracticesMatch[1];
		const subSections = bestPracticesFullText.split(/(?=### )/);

		for (const subSection of subSections) {
			if (!subSection.startsWith("### ")) continue;

			const lines = subSection.split("\n");
			const subTitle = lines[0].replace("### ", "").trim();
			const subSlug = subTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

			const dos =
				subSection
					.match(
						/\*\*Do's ✅\*\*\s*\n([\s\S]*?)(?=\n\s*\*\*Don'ts ❌\*\*|$)/,
					)?.[1]
					?.split("\n")
					.map((l) => l.trim())
					.filter((l) => l.startsWith("- "))
					.map((l) => l.slice(2)) || [];
			const donts =
				subSection
					.match(/\*\*Don'ts ❌\*\*\s*\n([\s\S]*?)(?=\n\s*\*\*|$)/)?.[1]
					?.split("\n")
					.map((l) => l.trim())
					.filter((l) => l.startsWith("- "))
					.map((l) => l.slice(2)) || [];

			const numPairs = Math.max(dos.length, donts.length);

			for (let i = 0; i < numPairs; i++) {
				const pairSlug = `do-dont-${subSlug}-${i + 1}`;
				if (
					targetPair &&
					pairSlug !== targetPair &&
					pairSlug !== `do-dont-${targetPair}`
				)
					continue;

				const doPoint = dos[i] || `Correct implementation of ${subTitle}`;
				const dontPoint = donts[i] || `Wrong implementation of ${subTitle}`;

				if (!promptsConfig[patternName][pairSlug]) {
					promptsConfig[patternName][pairSlug] = {
						do: doPoint,
						dont: dontPoint,
						locked: false,
						prompt: `Create a professional UX comparison illustration for the "${patternName}" pattern. Focus on: "${subTitle}".

STRICT LAYOUT (PIXEL-PERFECT CONSISTENCY):
- BACKGROUND: Entire image MUST have a solid, flat light gray background (#F5F5F7). No gradients, no shadows on the background itself.
- SEPARATOR: A thin, subtle vertical divider line must be placed EXACTLY in the horizontal center, running from top to bottom.
- PANELS: Two perfectly symmetrical vertical panels.
- TOP: Centered status icons. LEFT: Red circle with white "X". RIGHT: Green circle with white "Checkmark". 
- ICONS: Both icons must be the same size and at the exact same vertical height.

CONTRAST:
- LEFT (WRONG): ${dontPoint}
- RIGHT (CORRECT): ${doPoint}

UI CARDS:
- CENTER: Place a clean, white rounded-corner card (#FFFFFF, 12px radius) in each panel.
- SHADOWS: Use very subtle, consistent soft drop shadows on the cards.
- CONTENT: Show minimal, realistic UI components.

CAPTIONS:
- BOTTOM: Small, clear captions (#333333, ~14pt). 
- NO TRUNCATION: Write the full text. Wrap if needed. 
- LEFT: "${dontPoint}"
- RIGHT: "${doPoint}"

AESTHETIC: Apple/Dribbble minimalist product design. High visual balance and alignment.`,
					};
				}

				const entry = promptsConfig[patternName][pairSlug];

				// Save prompts incrementally
				await writeFile(
					promptsFile,
					JSON.stringify(promptsConfig, null, 2),
					"utf8",
				);

				if (isScanOnly) continue;

				// Respect locked flag unless --force-all is used
				if (entry.locked && !isForceAll) {
					console.log(
						`  Skipping ${pairSlug}: Locked in prompts.json (use --force-all to override)`,
					);
					continue;
				}

				const outDir = path.join(
					process.cwd(),
					`apps/web/public/patterns/${patternName}`,
				);
				const imageExists = existsSync(path.join(outDir, `${pairSlug}.webp`));

				if (imageExists && !isForce && !isForceAll) continue;

				console.log(
					`  Generating image ${i + 1}/${numPairs} for "${subTitle}"...`,
				);
				const promptText = entry.prompt;

				try {
					if (!ai) {
						throw new Error("Missing Gemini client while generating images.");
					}

					const response = await ai.models.generateContentStream({
						model,
						config: config as any,
						contents: [{ role: "user", parts: [{ text: promptText }] }],
					});

					let imageBuffer: Buffer | null = null;

					for await (const chunk of response) {
						if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
							const inlineData =
								chunk.candidates[0].content.parts[0].inlineData;
							imageBuffer = Buffer.from(inlineData.data || "", "base64");
						}
					}

					if (imageBuffer) {
						if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

						const optimizedBuffer = await sharp(imageBuffer)
							.webp({ quality: 80, effort: 6 })
							.toBuffer();

						await writeFile(
							path.join(outDir, `${pairSlug}.webp`),
							optimizedBuffer,
						);
						console.log(`  Saved optimized image to ${pairSlug}.webp`);

						const legacyPng = path.join(outDir, `${pairSlug}.png`);
						if (existsSync(legacyPng)) {
							await import("node:fs/promises").then((fs) =>
								fs.unlink(legacyPng),
							);
							console.log(`  Deleted legacy PNG: ${pairSlug}.png`);
						}
					}
				} catch (e) {
					console.error(`  Error generating ${pairSlug}:`, e);
				}

				// If we targeted a specific pattern AND pair, stop immediately.
				if (targetPattern && targetPair) {
					console.log(
						`\nTargeted pair "${targetPair}" for pattern "${targetPattern}" complete. Stopping.`,
					);
					process.exit(0);
				}

				if (isDryRun && !targetPattern) break;
			}

			if (isDryRun && !targetPattern) break;
		}

		if (isDryRun) break;
	}
	console.log("\nDone.");
}

main().catch(console.error);
