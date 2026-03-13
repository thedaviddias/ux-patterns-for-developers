import "dotenv/config";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

async function main() {
	const args = process.argv.slice(2);
	const targetPatternArg = args.find((arg) => arg.startsWith("--pattern="));
	const targetPattern = targetPatternArg
		? targetPatternArg.split("=")[1]
		: null;
	const targetPairArg = args.find((arg) => arg.startsWith("--pair="));
	const targetPair = targetPairArg ? targetPairArg.split("=")[1] : null;

	if (!targetPattern || !targetPair) {
		console.error(
			"Usage: npx tsx scripts/ux-illustrations/optimizer.ts --pattern=<pattern-name> --pair=<do-dont-slug>",
		);
		console.error(
			"Example: npx tsx scripts/ux-illustrations/optimizer.ts --pattern=autocomplete --pair=do-dont-content-1",
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

	const ai = new GoogleGenAI({
		apiKey,
	});

	const model = "gemini-2.5-flash";

	const promptsFile = path.join(
		process.cwd(),
		"scripts",
		"ux-illustrations",
		"prompts.json",
	);
	if (!existsSync(promptsFile)) {
		console.error(`Error: Could not find prompts file at ${promptsFile}`);
		process.exit(1);
	}

	const promptsConfig = JSON.parse(await readFile(promptsFile, "utf8"));

	if (
		!promptsConfig[targetPattern] ||
		!promptsConfig[targetPattern][targetPair]
	) {
		console.error(
			`Error: Could not find entry for pattern "${targetPattern}" and pair "${targetPair}" in prompts.json`,
		);
		process.exit(1);
	}

	const entry = promptsConfig[targetPattern][targetPair];

	console.log(`\nOptimizing prompt for: ${targetPattern} -> ${targetPair}`);
	console.log(
		`Current Objective:\n- WRONG: ${entry.dont}\n- CORRECT: ${entry.do}\n`,
	);

	const systemInstruction = `You are an expert AI Prompt Engineer specializing in generating UI/UX illustrations.
Your job is to rewrite and optimize a base prompt to ensure the image generation model produces highly accurate, hallucination-free, and perfectly structured UI mockups.

Here are the strict rules for the rewrite:
1. DO NOT change the "STRICT LAYOUT" or "CAPTIONS" sections of the original prompt. They are mathematically precise.
2. Focus ONLY on rewriting the "CONTRAST" and "UI CARDS" sections.
3. Replace generic terms with highly specific visual descriptions. (e.g., instead of "Show a bad dropdown", write "Inside the left card, draw a white dropdown menu without a scrollbar, overflowing the card edges. Inside the right card, draw a dropdown with a visible gray scrollbar track.")
4. Use descriptive UI terminology (padding, borders, hex colors, shadows, typography hierarchies).
5. Ensure the description directly addresses the DO and DONT strings provided.

Output the ENTIRE optimized prompt string exactly as it should be passed to the image generator. Do not wrap it in markdown blocks or add conversational filler.`;

	const userPrompt = `Please optimize the following prompt for the "${targetPattern}" UI pattern.
The goal is to illustrate this concept:
WRONG: ${entry.dont}
RIGHT: ${entry.do}

--- ORIGINAL PROMPT ---
${entry.prompt}
--- END ORIGINAL PROMPT ---`;

	try {
		console.log("Analyzing and rewriting prompt...");
		const result = await ai.models.generateContent({
			model,
			systemInstruction: {
				role: "system",
				parts: [{ text: systemInstruction }],
			},
			contents: [{ role: "user", parts: [{ text: userPrompt }] }],
		});

		const optimizedPrompt =
			result.text?.trim() || result.response?.text()?.trim();

		if (optimizedPrompt) {
			promptsConfig[targetPattern][targetPair].prompt = optimizedPrompt;
			await writeFile(
				promptsFile,
				JSON.stringify(promptsConfig, null, 2),
				"utf8",
			);
			console.log(
				"\n✅ Success! The prompt has been optimized and saved to prompts.json.",
			);
			console.log("\nTo test the new prompt, run:");
			console.log(
				`npx tsx scripts/ux-illustrations/generator.ts --pattern=${targetPattern} --pair=${targetPair} --force`,
			);
		} else {
			console.error("Failed to generate an optimized prompt.");
		}
	} catch (e) {
		console.error("Error optimizing prompt:", e);
	}
}

main().catch(console.error);
