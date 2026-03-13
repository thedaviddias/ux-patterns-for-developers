import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
	appendSynonymToSource,
	insertGlossaryLink,
	runGlossarySync,
} from "./glossary-sync-lib.mjs";

async function createFixtureWorkspace() {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), "glossary-sync-"));
	const patternsRoot = path.join(root, "content", "patterns");
	const glossaryRoot = path.join(root, "content", "glossary");
	const outputRoot = path.join(root, ".generated", "glossary-sync");

	await fs.mkdir(patternsRoot, { recursive: true });
	await fs.mkdir(glossaryRoot, { recursive: true });

	return { root, patternsRoot, glossaryRoot, outputRoot };
}

async function writeFile(targetPath, source) {
	await fs.mkdir(path.dirname(targetPath), { recursive: true });
	await fs.writeFile(targetPath, source, "utf8");
}

function glossarySource({
	title,
	slug,
	description = `${title} definition.`,
	synonyms = [],
}) {
	return `---
title: "${title}"
description: "${description}"
category: ["UX"]
related_patterns: []
synonyms: ${JSON.stringify(synonyms)}
status: published
---

${title} glossary entry.
`;
}

function patternSource({ title, body, aliases = [], keywords = [], tags = [] }) {
	return `---
title: "${title}"
description: "${title} pattern"
aliases: ${JSON.stringify(aliases)}
keywords: ${JSON.stringify(keywords)}
tags: ${JSON.stringify(tags)}
status: complete
---

${body}
`;
}

test("insertGlossaryLink skips inline code and existing links", () => {
	const inlineCode = insertGlossaryLink("Use `Pagination` in code.", "Pagination", "pagination");
	assert.equal(inlineCode.changed, false);

	const existingLink = insertGlossaryLink(
		"Read [Pagination](/glossary/pagination) first.",
		"Pagination",
		"pagination",
	);
	assert.equal(existingLink.changed, false);

	const prose = insertGlossaryLink(
		"Pagination improves large result sets.",
		"Pagination",
		"pagination",
	);
	assert.equal(prose.changed, true);
	assert.equal(
		prose.text,
		"[Pagination](/glossary/pagination) improves large result sets.",
	);
});

test("appendSynonymToSource preserves inline array formatting and avoids duplicates", () => {
	const source = `---
title: "Pagination"
synonyms: ["Paging"]
status: published
---
`;

	const updated = appendSynonymToSource(source, "Page navigation");
	assert.equal(updated.changed, true);
	assert.match(updated.source, /synonyms: \["Paging", "Page navigation"\]/);

	const duplicate = appendSynonymToSource(updated.source, "Page navigation");
	assert.equal(duplicate.changed, false);
});

test("audit mode produces reports without editing source files", async () => {
	const fixture = await createFixtureWorkspace();
	await writeFile(
		path.join(fixture.glossaryRoot, "p", "pagination.mdx"),
		glossarySource({ title: "Pagination", slug: "pagination" }),
	);
	const patternPath = path.join(fixture.patternsRoot, "navigation", "pagination.mdx");
	const originalPattern = patternSource({
		title: "Pagination Pattern",
		body: "## Overview\n\nPagination helps users move through large result sets.\n",
	});
	await writeFile(patternPath, originalPattern);

	const report = await runGlossarySync({
		mode: "audit",
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
		ai: null,
	});

	const persistedPattern = await fs.readFile(patternPath, "utf8");
	assert.equal(persistedPattern, originalPattern);
	assert.equal(report.summary.patternsScanned, 1);
	assert.equal(report.summary.linkEdits, 1);

	const reportJson = JSON.parse(
		await fs.readFile(path.join(fixture.outputRoot, "report.json"), "utf8"),
	);
	assert.equal(reportJson.summary.patternsScanned, 1);
});

test("sync mode links glossary terms once and ignores headings, code, tables, jsx, and existing links", async () => {
	const fixture = await createFixtureWorkspace();
	await writeFile(
		path.join(fixture.glossaryRoot, "p", "pagination.mdx"),
		glossarySource({ title: "Pagination", slug: "pagination" }),
	);
	const patternPath = path.join(fixture.patternsRoot, "navigation", "load-more.mdx");
	await writeFile(
		patternPath,
		patternSource({
			title: "Load More",
			body: `## Overview

Pagination keeps large datasets manageable.

\`Pagination\` inside code should stay untouched.

<InfoBox>Pagination inside JSX should stay untouched.</InfoBox>

| Pattern | Notes |
| --- | --- |
| Pagination | Table content should stay untouched |

## Pagination

Read [Pagination](/glossary/pagination) for the linked version.
`,
		}),
	);

	await runGlossarySync({
		mode: "sync",
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
		ai: null,
	});

	const updated = await fs.readFile(patternPath, "utf8");
	assert.match(updated, /\[Pagination\]\(\/glossary\/pagination\) keeps large datasets manageable\./);
	assert.equal(
		(updated.match(/\]\(\/glossary\/pagination\)/g) ?? []).length,
		2,
	);
	assert.match(updated, /`Pagination` inside code should stay untouched\./);
	assert.match(updated, /<InfoBox>Pagination inside JSX should stay untouched\.<\/InfoBox>/);
	assert.match(updated, /\| Pagination \| Table content should stay untouched \|/);
	assert.match(updated, /^## Pagination$/m);
});

test("existing synonym maps to canonical term without creating duplicate glossary files", async () => {
	const fixture = await createFixtureWorkspace();
	await writeFile(
		path.join(fixture.glossaryRoot, "p", "pagination.mdx"),
		glossarySource({
			title: "Pagination",
			slug: "pagination",
			synonyms: ["Page navigation"],
		}),
	);

	await writeFile(
		path.join(fixture.patternsRoot, "navigation", "search-results.mdx"),
		patternSource({
			title: "Search Results",
			body: "## Overview\n\nPage navigation helps users browse result pages.\n",
		}),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "navigation", "catalog.mdx"),
		patternSource({
			title: "Catalog",
			body: "## Overview\n\nPage navigation is easier to scan than an endless list.\n",
		}),
	);

	const report = await runGlossarySync({
		mode: "sync",
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
		ai: null,
	});

	assert.equal(report.summary.linkEdits, 2);
	assert.equal(report.summary.synonymUpdates, 0);

	const glossaryFiles = await fs.readdir(path.join(fixture.glossaryRoot, "p"));
	assert.deepEqual(glossaryFiles.sort(), ["pagination.mdx"]);
});

test("instructional phrases map to canonical glossary terms instead of becoming new terms", async () => {
	const fixture = await createFixtureWorkspace();
	await writeFile(
		path.join(fixture.glossaryRoot, "t", "touch-targets.mdx"),
		glossarySource({ title: "Touch Targets", slug: "touch-targets" }),
	);
	const patternPath = path.join(fixture.patternsRoot, "forms", "button.mdx");
	await writeFile(
		patternPath,
		patternSource({
			title: "Button",
			body: "## Accessibility\n\nEnsure touch targets are at least 44 by 44 pixels.\n",
		}),
	);

	const report = await runGlossarySync({
		mode: "sync",
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
		ai: null,
	});

	assert.equal(
		report.findings.some((finding) => finding.action === "create-glossary-draft"),
		false,
	);

	const updated = await fs.readFile(patternPath, "utf8");
	assert.match(
		updated,
		/Ensure \[touch targets\]\(\/glossary\/touch-targets\) are at least 44 by 44 pixels\./i,
	);
});

test("ambiguous phrases are reported for review and not edited", async () => {
	const fixture = await createFixtureWorkspace();
	await writeFile(
		path.join(fixture.glossaryRoot, "u", "user-flow.mdx"),
		glossarySource({ title: "User Flow", slug: "user-flow" }),
	);
	await writeFile(
		path.join(fixture.glossaryRoot, "t", "task-flow.mdx"),
		glossarySource({ title: "Task Flow", slug: "task-flow" }),
	);
	const patternPath = path.join(fixture.patternsRoot, "advanced", "wizard.mdx");
	await writeFile(
		patternPath,
		patternSource({
			title: "Wizard",
			aliases: ["Flow"],
			body: "## Overview\n\nA flow can improve task completion when the steps are clear.\n",
		}),
	);

	const report = await runGlossarySync({
		mode: "sync",
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
		ai: null,
	});

	const flowFinding = report.findings.find((finding) => finding.phrase === "Flow");
	assert.equal(flowFinding?.action, "review");

	const updated = await fs.readFile(patternPath, "utf8");
	assert.doesNotMatch(updated, /\]\(\/glossary\//);
});

test("sync mode can create a new glossary draft with AI summaries", async () => {
	const fixture = await createFixtureWorkspace();
	await writeFile(
		path.join(fixture.patternsRoot, "ai-intelligence", "prompt-input.mdx"),
		patternSource({
			title: "Prompt Input",
			keywords: ["Prompt budget"],
			body: "## Overview\n\nPrompt budget helps teams control context cost.\n",
		}),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "ai-intelligence", "token-counter.mdx"),
		patternSource({
			title: "Token Counter",
			keywords: ["Prompt budget"],
			body: "## Overview\n\nPrompt budget prevents context overflow in multi-step chat.\n",
		}),
	);

	const ai = {
		models: {
			generateContent: async ({ contents }) => {
				const prompt = Array.isArray(contents) ? contents.join("\n") : contents;
				if (String(prompt).includes("draft glossary entry")) {
					return {
						text: JSON.stringify({
							title: "Prompt Budget",
							description: "The token or context allowance reserved for a prompt or conversation turn.",
							definition:
								"Prompt budget defines how much context or token space a prompt can consume before the interface trims, warns, or rejects additional input.",
							synonyms: ["Context budget"],
							category: ["Technical"],
						}),
					};
				}

				return { text: JSON.stringify({ slug: null, confidence: 0 }) };
			},
		},
	};

	const report = await runGlossarySync({
		mode: "sync",
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
		ai,
	});

	assert.equal(report.summary.draftsCreated, 1);

	const draftPath = path.join(
		fixture.glossaryRoot,
		"p",
		"prompt-budget.mdx",
	);
	const draft = await fs.readFile(draftPath, "utf8");
	assert.match(draft, /title: "Prompt Budget"/);
	assert.match(draft, /status: draft/);
	assert.match(draft, /"\/patterns\/ai-intelligence\/prompt-input"/);
	assert.match(draft, /"\/patterns\/ai-intelligence\/token-counter"/);
});

test("structural documentation phrases do not become AI draft glossary terms", async () => {
	const fixture = await createFixtureWorkspace();
	await writeFile(
		path.join(fixture.patternsRoot, "advanced", "alpha.mdx"),
		patternSource({
			title: "Alpha",
			body: "## Best Practices\n\n**The Problem:** People miss the next step.\n",
		}),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "advanced", "beta.mdx"),
		patternSource({
			title: "Beta",
			body: "## Best Practices\n\n**The Problem:** Users lose context in the flow.\n",
		}),
	);

	const ai = {
		models: {
			generateContent: async () => {
				throw new Error("AI should not be called for blocked boilerplate phrases");
			},
		},
	};

	const report = await runGlossarySync({
		mode: "audit",
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
		ai,
	});

	assert.equal(
		report.findings.some((finding) => finding.action === "create-glossary-draft"),
		false,
	);
});
