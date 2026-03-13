import "dotenv/config";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { glob } from "glob";

async function main() {
	const args = process.argv.slice(2);
	const targetPatternArg = args.find((arg) => arg.startsWith("--pattern="));
	const targetPattern = targetPatternArg
		? targetPatternArg.split("=")[1]
		: null;
	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey) {
		console.error(
			"Error: GEMINI_API_KEY environment variable is not set in .env",
		);
		process.exit(1);
	}

	const ai = new GoogleGenAI({
		apiKey,
	});

	const model = "gemini-1.5-flash";

	const reportFile = path.join(
		process.cwd(),
		"scripts",
		"ux-illustrations",
		"qa-report.json",
	);
	let fullReport: Record<string, any> = {};
	if (existsSync(reportFile)) {
		try {
			fullReport = JSON.parse(await readFile(reportFile, "utf8"));
		} catch (_e) {
			console.warn("Could not parse qa-report.json. Starting fresh.");
		}
	}

	const images = await glob("apps/web/public/patterns/**/do-dont-*.png");

	if (images.length === 0) {
		console.log("No generated images found to audit.");
		return;
	}

	console.log(`Auditing ${images.length} images...`);

	for (const imgPath of images) {
		const patternName = path.basename(path.dirname(imgPath));
		const imageName = path.basename(imgPath);
		const imageKey = `${patternName}/${imageName}`;

		if (targetPattern && patternName !== targetPattern) continue;

		console.log(`\nReviewing: ${imageKey}`);

		const imageBuffer = await readFile(imgPath);
		const base64Image = imageBuffer.toString("base64");

		const promptText = `You are a Senior UX Designer performing a Visual QA on a series of Do/Don't comparison illustrations.

Review the attached image against these criteria:
1. **Icons:** The LEFT panel must have a Red "X" icon at the top. The RIGHT panel must have a Green "Checkmark" icon.
2. **Text Clarity:** Are the captions at the bottom clearly legible, correctly spelled, and NOT truncated?
3. **Contrast:** Does the UI shown clearly illustrate the difference between "Wrong" and "Right" for this pattern?
4. **Artifacts:** Are there any weird "hallucinated" floating elements, broken borders, or misaligned text blocks?
5. **Aesthetic:** Does it feel professional, clean, and consistent with a minimalist Apple/Dribbble style?

Output your response ONLY as a JSON object with this structure:
{
  "status": "PASS" | "WARNING" | "FAIL",
  "score": number (1-10),
  "critique": "short summary of issues found",
  "suggested_prompt_tweak": "a specific instruction to add to the generation prompt to fix this issue"
}`;

		try {
			const result = await ai.models.generateContent({
				model,
				contents: [
					{
						role: "user",
						parts: [
							{ text: promptText },
							{
								inlineData: {
									data: base64Image,
									mimeType: "image/png",
								},
							},
						],
					},
				],
			});

			const responseText = result.response.text();
			const cleanedJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
			const review = JSON.parse(cleanedJson);

			console.log(`  Result: ${review.status} (Score: ${review.score}/10)`);
			if (review.critique) console.log(`  Critique: ${review.critique}`);

			fullReport[imageKey] = {
				...review,
				timestamp: new Date().toISOString(),
			};

			await writeFile(reportFile, JSON.stringify(fullReport, null, 2), "utf8");
		} catch (e) {
			console.error(`  Error auditing ${imageKey}:`, e);
		}
	}

	let mdReport = "# Banana Visual QA Audit Report\n\n";
	const stats = { PASS: 0, WARNING: 0, FAIL: 0 };

	for (const [_key, val] of Object.entries(fullReport)) {
		const status = val.status as keyof typeof stats;
		if (Object.hasOwn(stats, status)) {
			stats[status]++;
		}
	}

	mdReport += `## Summary\n- **PASS:** ${stats.PASS}\n- **WARNING:** ${stats.WARNING}\n- **FAIL:** ${stats.FAIL}\n\n`;
	mdReport += "## Detailed Findings\n\n";

	for (const [key, val] of Object.entries(fullReport)) {
		if (val.status === "PASS" && !targetPattern) continue;

		mdReport += `### ${key} [${val.status}]\n`;
		mdReport += `- **Score:** ${val.score}/10\n`;
		mdReport += `- **Critique:** ${val.critique}\n`;
		if (val.suggested_prompt_tweak) {
			mdReport += `- **Suggested Fix:** \`${val.suggested_prompt_tweak}\`\n`;
		}
		mdReport += `\n![${key}](../../apps/web/public/patterns/${key})\n\n---\n`;
	}

	await writeFile(
		path.join(process.cwd(), "scripts", "ux-illustrations", "qa-report.md"),
		mdReport,
		"utf8",
	);
	console.log(
		`\nAudit complete! Reports saved to scripts/ux-illustrations/qa-report.json and scripts/ux-illustrations/qa-report.md`,
	);
}

main().catch(console.error);
