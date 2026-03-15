#!/usr/bin/env node

import {
	runGlossaryRelevanceReport,
	runGlossarySync,
} from "./glossary-sync-lib.mjs";

async function main() {
	const args = process.argv.slice(2);
	const modeArg = args.find((value) => value.startsWith("--mode="));
	const patternArg = args.find((value) => value.startsWith("--pattern="));
	const dryRun = args.includes("--dry-run");
	const mode = modeArg?.split("=")[1] ?? "audit";

	if (!["audit", "relevance", "sync"].includes(mode)) {
		console.error(
			`Invalid mode "${mode}". Expected audit, relevance, or sync.`,
		);
		process.exit(1);
	}

	if (mode === "relevance") {
		const report = await runGlossaryRelevanceReport();

		console.log("Glossary relevance report complete.");
		console.log(
			`Candidates: ${report.summary.candidates}, high: ${report.summary.high}, medium: ${report.summary.medium}, low: ${report.summary.low}.`,
		);
		console.log(`Report written to ${report.outputRoot}`);
		return;
	}

	const report = await runGlossarySync({
		mode,
		pattern: patternArg?.split("=")[1],
		dryRun,
	});

	console.log(`Glossary sync ${mode} complete.`);
	console.log(
		`Patterns: ${report.summary.patternsScanned}, glossary entries: ${report.summary.glossaryEntriesScanned}, findings: ${report.summary.findings}.`,
	);
	console.log(
		`Link edits: ${report.summary.linkEdits}, synonym updates: ${report.summary.synonymUpdates}, drafts created: ${report.summary.draftsCreated}.`,
	);
	console.log(`Report written to ${report.outputRoot}`);
}

main().catch((error) => {
	console.error("Glossary sync failed.");
	console.error(error);
	process.exit(1);
});
