import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
	appendSynonymToSource,
	insertGlossaryLink,
	runGlossaryRelevanceReport,
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

async function writeAuditReport(outputRoot, findings) {
	await fs.mkdir(outputRoot, { recursive: true });
	await fs.writeFile(
		path.join(outputRoot, "report.json"),
		`${JSON.stringify({ findings }, null, 2)}\n`,
		"utf8",
	);
}

async function writeRelevanceReport(outputRoot, candidates) {
	await fs.mkdir(outputRoot, { recursive: true });
	await fs.writeFile(
		path.join(outputRoot, "relevance-report.json"),
		`${JSON.stringify({ summary: { candidates: candidates.length }, candidates }, null, 2)}\n`,
		"utf8",
	);
}

async function writeApprovalConfig(root, approvedMediumTerms = []) {
	const configPath = path.join(root, "config", "glossary-medium-approvals.json");
	await writeFile(
		configPath,
		`${JSON.stringify({ approvedMediumTerms }, null, 2)}\n`,
	);
	return configPath;
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
	await writeApprovalConfig(fixture.root, []);
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
	await writeAuditReport(fixture.outputRoot, [
		{ action: "create-glossary-draft", phrase: "prompt budget", proposedTerm: "Prompt Budget" },
	]);
	await writeRelevanceReport(fixture.outputRoot, [
		{
			phrase: "prompt budget",
			proposedTerm: "Prompt Budget",
			relevanceScore: 82,
			tier: "high",
			recommendedAction: "keep-review",
		},
	]);

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
		auditReportPath: path.join(fixture.outputRoot, "report.json"),
		relevanceReportPath: path.join(fixture.outputRoot, "relevance-report.json"),
		approvalConfigPath: path.join(
			fixture.root,
			"config",
			"glossary-medium-approvals.json",
		),
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

test("glossary relevance ranks stable UX terms above structural phrases", async () => {
	const fixture = await createFixtureWorkspace();
	await writeFile(
		path.join(fixture.patternsRoot, "forms", "text-field.mdx"),
		patternSource({
			title: "Text Field",
			body: `## Overview

Helper text helps people complete forms accurately.

## Best Practices

Helper text should clarify formatting and expected input.
`,
		}),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "forms", "date-input.mdx"),
		patternSource({
			title: "Date Input",
			body: `## Accessibility

Helper text should explain accepted date formats.

## Best Practices

**The Problem:** People get blocked when labels are vague.
`,
		}),
	);
	await writeAuditReport(fixture.outputRoot, [
		{
			action: "create-glossary-draft",
			phrase: "helper text",
			proposedTerm: "Helper Text",
			sourcePatterns: ["forms/text-field", "forms/date-input"],
		},
		{
			action: "create-glossary-draft",
			phrase: "the problem",
			proposedTerm: "The Problem",
			sourcePatterns: ["forms/text-field", "forms/date-input"],
		},
	]);

	const report = await runGlossaryRelevanceReport({
		reportPath: path.join(fixture.outputRoot, "report.json"),
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
	});

	const helperText = report.candidates.find(
		(candidate) => candidate.proposedTerm === "Helper Text",
	);
	const problem = report.candidates.find(
		(candidate) => candidate.proposedTerm === "The Problem",
	);

	assert.ok(helperText.relevanceScore > problem.relevanceScore);
	assert.notEqual(helperText.tier, "low");
	assert.equal(problem.tier, "low");
});

test("glossary relevance lowers faq and checklist heavy candidates", async () => {
	const fixture = await createFixtureWorkspace();
	await writeFile(
		path.join(fixture.patternsRoot, "content-management", "accordion.mdx"),
		patternSource({
			title: "Accordion",
			body: `## Overview

Focus order keeps keyboard navigation predictable.

## Accessibility

Focus order should remain logical when sections expand.
`,
		}),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "content-management", "faq.mdx"),
		patternSource({
			title: "FAQ",
			body: `## Frequently Asked Questions

- [ ] Focus order matters when answers expand.
- [ ] Focus order should stay stable after interaction.
`,
		}),
	);
	await writeAuditReport(fixture.outputRoot, [
		{
			action: "create-glossary-draft",
			phrase: "focus order",
			proposedTerm: "Focus Order",
			sourcePatterns: ["content-management/accordion", "content-management/faq"],
		},
	]);

	const report = await runGlossaryRelevanceReport({
		reportPath: path.join(fixture.outputRoot, "report.json"),
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
	});

	const focusOrder = report.candidates[0];
	assert.equal(focusOrder.signals.proseMentions, 2);
	assert.equal(focusOrder.signals.faqMentions, 1);
	assert.equal(focusOrder.signals.checklistMentions, 1);
	assert.equal(focusOrder.tier, "medium");
});

test("glossary relevance penalizes overlap with existing glossary entries", async () => {
	const fixture = await createFixtureWorkspace();
	await writeFile(
		path.join(fixture.glossaryRoot, "t", "touch-targets.mdx"),
		glossarySource({ title: "Touch Targets", slug: "touch-targets" }),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "forms", "button.mdx"),
		patternSource({
			title: "Button",
			body: `## Accessibility

Ensure touch targets remain large enough on mobile.

## Best Practices

Touch targets should remain easy to tap.
`,
		}),
	);
	await writeAuditReport(fixture.outputRoot, [
		{
			action: "create-glossary-draft",
			phrase: "Ensure touch targets",
			proposedTerm: "Touch Targets",
			sourcePatterns: ["forms/button"],
		},
	]);

	const report = await runGlossaryRelevanceReport({
		reportPath: path.join(fixture.outputRoot, "report.json"),
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
	});

	const candidate = report.candidates[0];
	assert.equal(
		candidate.evidence.nearestExistingGlossaryTerm?.slug,
		"touch-targets",
	);
	assert.ok(candidate.signals.existingGlossarySimilarity >= 0.9);
	assert.equal(candidate.recommendedAction, "reject");
});

test("glossary relevance writes deterministic reports without editing content", async () => {
	const fixture = await createFixtureWorkspace();
	const patternPath = path.join(fixture.patternsRoot, "forms", "text-field.mdx");
	const source = patternSource({
		title: "Text Field",
		body: "## Overview\n\nHelper text improves completion.\n",
	});
	await writeFile(patternPath, source);
	await writeAuditReport(fixture.outputRoot, [
		{
			action: "create-glossary-draft",
			phrase: "helper text",
			proposedTerm: "Helper Text",
			sourcePatterns: ["forms/text-field"],
		},
	]);

	const first = await runGlossaryRelevanceReport({
		reportPath: path.join(fixture.outputRoot, "report.json"),
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
	});
	const second = await runGlossaryRelevanceReport({
		reportPath: path.join(fixture.outputRoot, "report.json"),
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
	});

	assert.deepEqual(first, second);
	assert.equal(await fs.readFile(patternPath, "utf8"), source);
	assert.ok(
		await fs.readFile(
			path.join(fixture.outputRoot, "relevance-report.json"),
			"utf8",
		),
	);
	assert.ok(
		await fs.readFile(
			path.join(fixture.outputRoot, "relevance-report.md"),
			"utf8",
		),
	);
});

test("sync creates high relevance drafts without allowlist approval", async () => {
	const fixture = await createFixtureWorkspace();
	await writeApprovalConfig(fixture.root, []);
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
	await writeAuditReport(fixture.outputRoot, [
		{ action: "create-glossary-draft", phrase: "prompt budget", proposedTerm: "Prompt Budget" },
	]);
	await writeRelevanceReport(fixture.outputRoot, [
		{
			phrase: "prompt budget",
			proposedTerm: "Prompt Budget",
			relevanceScore: 82,
			tier: "high",
			recommendedAction: "keep-review",
		},
	]);

	const ai = {
		models: {
			generateContent: async ({ contents }) => {
				const prompt = Array.isArray(contents) ? contents.join("\n") : contents;
				if (String(prompt).includes("draft glossary entry")) {
					return {
						text: JSON.stringify({
							title: "Prompt Budget",
							description: "The token or context allowance reserved for a prompt or conversation turn.",
							definition: "Prompt budget defines how much context or token space a prompt can consume before the interface trims, warns, or rejects additional input.",
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
		auditReportPath: path.join(fixture.outputRoot, "report.json"),
		relevanceReportPath: path.join(fixture.outputRoot, "relevance-report.json"),
		approvalConfigPath: path.join(
			fixture.root,
			"config",
			"glossary-medium-approvals.json",
		),
		ai,
	});

	assert.equal(report.summary.draftsCreated, 1);
	const draft = await fs.readFile(
		path.join(fixture.glossaryRoot, "p", "prompt-budget.mdx"),
		"utf8",
	);
	assert.match(draft, /title: "Prompt Budget"/);
});

test("sync blocks medium relevance drafts when they are not allowlisted", async () => {
	const fixture = await createFixtureWorkspace();
	await writeApprovalConfig(fixture.root, []);
	await writeFile(
		path.join(fixture.patternsRoot, "forms", "text-field.mdx"),
		patternSource({
			title: "Text Field",
			keywords: ["Helper text"],
			body: "## Overview\n\nHelper text helps people understand constraints.\n",
		}),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "forms", "date-input.mdx"),
		patternSource({
			title: "Date Input",
			keywords: ["Helper text"],
			body: "## Overview\n\nHelper text can explain acceptable date formats.\n",
		}),
	);
	await writeAuditReport(fixture.outputRoot, [
		{ action: "create-glossary-draft", phrase: "helper text", proposedTerm: "Helper Text" },
	]);
	await writeRelevanceReport(fixture.outputRoot, [
		{
			phrase: "helper text",
			proposedTerm: "Helper Text",
			relevanceScore: 60,
			tier: "medium",
			recommendedAction: "defer",
		},
	]);

	const ai = {
		models: {
			generateContent: async ({ contents }) => {
				const prompt = Array.isArray(contents) ? contents.join("\n") : contents;
				if (String(prompt).includes("draft glossary entry")) {
					return {
						text: JSON.stringify({
							title: "Helper Text",
							description: "Concise inline text that provides additional guidance.",
							definition: "Helper text provides extra guidance near a control or field.",
							synonyms: ["Guidance text"],
							category: ["UX"],
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
		auditReportPath: path.join(fixture.outputRoot, "report.json"),
		relevanceReportPath: path.join(fixture.outputRoot, "relevance-report.json"),
		approvalConfigPath: path.join(
			fixture.root,
			"config",
			"glossary-medium-approvals.json",
		),
		ai,
	});

	assert.equal(report.summary.draftsCreated, 0);
	await assert.rejects(
		fs.readFile(path.join(fixture.glossaryRoot, "h", "helper-text.mdx"), "utf8"),
	);
	const finding = report.findings.find(
		(item) => item.proposedTerm === "Helper Text",
	);
	assert.equal(finding?.draftEligibility, "blocked-medium");
});

test("sync creates allowlisted medium relevance drafts", async () => {
	const fixture = await createFixtureWorkspace();
	await writeApprovalConfig(fixture.root, ["Helper Text"]);
	await writeFile(
		path.join(fixture.patternsRoot, "forms", "text-field.mdx"),
		patternSource({
			title: "Text Field",
			keywords: ["Helper text"],
			body: "## Overview\n\nHelper text helps people understand constraints.\n",
		}),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "forms", "date-input.mdx"),
		patternSource({
			title: "Date Input",
			keywords: ["Helper text"],
			body: "## Overview\n\nHelper text can explain acceptable date formats.\n",
		}),
	);
	await writeAuditReport(fixture.outputRoot, [
		{ action: "create-glossary-draft", phrase: "helper text", proposedTerm: "Helper Text" },
	]);
	await writeRelevanceReport(fixture.outputRoot, [
		{
			phrase: "helper text",
			proposedTerm: "Helper Text",
			relevanceScore: 60,
			tier: "medium",
			recommendedAction: "defer",
		},
	]);

	const ai = {
		models: {
			generateContent: async ({ contents }) => {
				const prompt = Array.isArray(contents) ? contents.join("\n") : contents;
				if (String(prompt).includes("draft glossary entry")) {
					return {
						text: JSON.stringify({
							title: "Helper Text",
							description: "Concise inline text that provides additional guidance.",
							definition: "Helper text provides extra guidance near a control or field.",
							synonyms: ["Guidance text"],
							category: ["UX"],
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
		auditReportPath: path.join(fixture.outputRoot, "report.json"),
		relevanceReportPath: path.join(fixture.outputRoot, "relevance-report.json"),
		approvalConfigPath: path.join(
			fixture.root,
			"config",
			"glossary-medium-approvals.json",
		),
		ai,
	});

	assert.equal(report.summary.draftsCreated, 1);
	const draft = await fs.readFile(
		path.join(fixture.glossaryRoot, "h", "helper-text.mdx"),
		"utf8",
	);
	assert.match(draft, /title: "Helper Text"/);
	const finding = report.findings.find(
		(item) => item.proposedTerm === "Helper Text",
	);
	assert.equal(finding?.draftEligibility, "approved-medium");
	assert.equal(finding?.approvalSource, "normalizedProposedTerm");
});

test("sync never creates low relevance drafts even if allowlisted", async () => {
	const fixture = await createFixtureWorkspace();
	await writeApprovalConfig(fixture.root, ["Semantic Elements"]);
	await writeFile(
		path.join(fixture.patternsRoot, "forms", "button.mdx"),
		patternSource({
			title: "Button",
			keywords: ["Semantic elements"],
			body: "## Accessibility\n\nUse semantic elements first.\n",
		}),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "forms", "checkbox.mdx"),
		patternSource({
			title: "Checkbox",
			keywords: ["Semantic elements"],
			body: "## Accessibility\n\nUse semantic elements before adding ARIA.\n",
		}),
	);
	await writeAuditReport(fixture.outputRoot, [
		{
			action: "create-glossary-draft",
			phrase: "semantic elements",
			proposedTerm: "Semantic Elements",
		},
	]);
	await writeRelevanceReport(fixture.outputRoot, [
		{
			phrase: "semantic elements",
			proposedTerm: "Semantic Elements",
			relevanceScore: 49,
			tier: "low",
			recommendedAction: "reject",
		},
	]);

	const ai = {
		models: {
			generateContent: async () => ({
				text: JSON.stringify({
					title: "Semantic Elements",
					description: "Elements with inherent semantic meaning.",
					definition: "Semantic elements carry meaning for users and assistive tech.",
					synonyms: [],
					category: ["Technical"],
				}),
			}),
		},
	};

	const report = await runGlossarySync({
		mode: "sync",
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
		auditReportPath: path.join(fixture.outputRoot, "report.json"),
		relevanceReportPath: path.join(fixture.outputRoot, "relevance-report.json"),
		approvalConfigPath: path.join(
			fixture.root,
			"config",
			"glossary-medium-approvals.json",
		),
		ai,
	});

	assert.equal(report.summary.draftsCreated, 0);
	const finding = report.findings.find(
		(item) => item.proposedTerm === "Semantic Elements",
	);
	assert.equal(finding?.draftEligibility, "blocked-low");
});

test("sync fails clearly when relevance report is missing", async () => {
	const fixture = await createFixtureWorkspace();
	await writeApprovalConfig(fixture.root, []);
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
	await writeAuditReport(fixture.outputRoot, [
		{ action: "create-glossary-draft", phrase: "prompt budget", proposedTerm: "Prompt Budget" },
	]);
	const ai = {
		models: {
			generateContent: async ({ contents }) => {
				const prompt = Array.isArray(contents) ? contents.join("\n") : contents;
				if (String(prompt).includes("draft glossary entry")) {
					return {
						text: JSON.stringify({
							title: "Prompt Budget",
							description: "The token or context allowance reserved for a prompt or conversation turn.",
							definition: "Prompt budget defines how much context or token space a prompt can consume before the interface trims, warns, or rejects additional input.",
							synonyms: ["Context budget"],
							category: ["Technical"],
						}),
					};
				}
				return { text: JSON.stringify({ slug: null, confidence: 0 }) };
			},
		},
	};

	await assert.rejects(
		runGlossarySync({
			mode: "sync",
			patternsRoot: fixture.patternsRoot,
			glossaryRoot: fixture.glossaryRoot,
			outputRoot: fixture.outputRoot,
			auditReportPath: path.join(fixture.outputRoot, "report.json"),
			relevanceReportPath: path.join(fixture.outputRoot, "relevance-report.json"),
			approvalConfigPath: path.join(
				fixture.root,
				"config",
				"glossary-medium-approvals.json",
			),
			ai,
		}),
		/missing glossary audit or relevance report/i,
	);
});

test("sync fails clearly when relevance report is older than the audit report", async () => {
	const fixture = await createFixtureWorkspace();
	await writeApprovalConfig(fixture.root, []);
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
	await writeAuditReport(fixture.outputRoot, [
		{ action: "create-glossary-draft", phrase: "prompt budget", proposedTerm: "Prompt Budget" },
	]);
	await writeRelevanceReport(fixture.outputRoot, [
		{
			phrase: "prompt budget",
			proposedTerm: "Prompt Budget",
			relevanceScore: 82,
			tier: "high",
			recommendedAction: "keep-review",
		},
	]);
	await writeAuditReport(fixture.outputRoot, []);
	const ai = {
		models: {
			generateContent: async ({ contents }) => {
				const prompt = Array.isArray(contents) ? contents.join("\n") : contents;
				if (String(prompt).includes("draft glossary entry")) {
					return {
						text: JSON.stringify({
							title: "Prompt Budget",
							description: "The token or context allowance reserved for a prompt or conversation turn.",
							definition: "Prompt budget defines how much context or token space a prompt can consume before the interface trims, warns, or rejects additional input.",
							synonyms: ["Context budget"],
							category: ["Technical"],
						}),
					};
				}
				return { text: JSON.stringify({ slug: null, confidence: 0 }) };
			},
		},
	};

	await assert.rejects(
		runGlossarySync({
			mode: "sync",
			patternsRoot: fixture.patternsRoot,
			glossaryRoot: fixture.glossaryRoot,
			outputRoot: fixture.outputRoot,
			auditReportPath: path.join(fixture.outputRoot, "report.json"),
			relevanceReportPath: path.join(fixture.outputRoot, "relevance-report.json"),
			approvalConfigPath: path.join(
				fixture.root,
				"config",
				"glossary-medium-approvals.json",
			),
			ai,
		}),
		/older than the audit report/i,
	);
});

test("sync still applies link updates when draft creation is blocked", async () => {
	const fixture = await createFixtureWorkspace();
	await writeApprovalConfig(fixture.root, []);
	await writeFile(
		path.join(fixture.glossaryRoot, "p", "pagination.mdx"),
		glossarySource({ title: "Pagination", slug: "pagination" }),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "navigation", "results.mdx"),
		patternSource({
			title: "Results",
			body: "## Overview\n\nPagination helps users move through long result sets.\n",
		}),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "forms", "text-field.mdx"),
		patternSource({
			title: "Text Field",
			keywords: ["Helper text"],
			body: "## Overview\n\nHelper text helps users understand a field.\n",
		}),
	);
	await writeFile(
		path.join(fixture.patternsRoot, "forms", "date-input.mdx"),
		patternSource({
			title: "Date Input",
			keywords: ["Helper text"],
			body: "## Overview\n\nHelper text can explain accepted date formats.\n",
		}),
	);
	await writeAuditReport(fixture.outputRoot, [
		{ action: "create-glossary-draft", phrase: "helper text", proposedTerm: "Helper Text" },
	]);
	await writeRelevanceReport(fixture.outputRoot, [
		{
			phrase: "helper text",
			proposedTerm: "Helper Text",
			relevanceScore: 60,
			tier: "medium",
			recommendedAction: "defer",
		},
	]);

	const report = await runGlossarySync({
		mode: "sync",
		patternsRoot: fixture.patternsRoot,
		glossaryRoot: fixture.glossaryRoot,
		outputRoot: fixture.outputRoot,
		auditReportPath: path.join(fixture.outputRoot, "report.json"),
		relevanceReportPath: path.join(fixture.outputRoot, "relevance-report.json"),
		approvalConfigPath: path.join(
			fixture.root,
			"config",
			"glossary-medium-approvals.json",
		),
		ai: null,
	});

	assert.equal(report.summary.draftsCreated, 0);
	assert.equal(report.summary.linkEdits, 1);
	const updated = await fs.readFile(
		path.join(fixture.patternsRoot, "navigation", "results.mdx"),
		"utf8",
	);
	assert.match(updated, /\[Pagination\]\(\/glossary\/pagination\) helps users/);
});
