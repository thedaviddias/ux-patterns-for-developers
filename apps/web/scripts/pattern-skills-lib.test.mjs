import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
	buildLlmsFullText,
	buildLlmsIndexText,
} from "../lib/pattern-skills-text.js";
import {
	generatePatternSkills,
	stripMdxToMarkdown,
} from "./pattern-skills-lib.mjs";

const SAMPLE_PATTERN = `---
title: "Tabs"
summary: "Switch between different views"
description: "Create accessible tab interfaces with keyboard navigation and responsive overflow handling."
aliases: ["tabbed interface"]
---

<PatternStats popularity="high" />

## Overview

Tabs organize related content into parallel sections without leaving the page.

## Use Cases

### When to use:

- Switch between related views in the same context
- Keep several content areas available without a page refresh

### When not to use:

- Multi-step flows that require completion in order
- Page navigation across different routes

## Examples

\`\`\`html
<div role="tablist"></div>
\`\`\`

## Best Practices

### Accessibility

- Use the full WAI-ARIA tab pattern
- Support Arrow key navigation

## Common Mistakes & Anti-Patterns

- Using the Tab key to move between tabs
- Navigating to another page from a tab trigger

## Performance

- Keep inactive panels cheap to render

## Related Patterns

- [Accordion](/patterns/content-management/accordion)
`;

async function createTempRepo() {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), "pattern-skills-"));

	await fs.writeFile(
		path.join(root, "pnpm-workspace.yaml"),
		"packages:\n  - apps/*\n",
	);
	await fs.mkdir(path.join(root, "apps/web/content/patterns/navigation"), {
		recursive: true,
	});

	return root;
}

test("stripMdxToMarkdown removes JSX wrappers and comments", () => {
	const output = stripMdxToMarkdown(`
{/* hidden */}
<PatternPreview />
## Heading

Content
`);

	assert.match(output, /## Heading/);
	assert.doesNotMatch(output, /PatternPreview/);
	assert.doesNotMatch(output, /hidden/);
});

test("generatePatternSkills writes pattern skill, reference, and manifest", async () => {
	const repoRoot = await createTempRepo();
	const patternPath = path.join(
		repoRoot,
		"apps/web/content/patterns/navigation/tabs.mdx",
	);

	await fs.writeFile(patternPath, SAMPLE_PATTERN);

	const manifest = await generatePatternSkills({ repoRoot });
	const skillPath = path.join(repoRoot, "skills/tabs/SKILL.md");
	const referencePath = path.join(
		repoRoot,
		"skills/tabs/references/pattern.md",
	);
	const manifestPath = path.join(
		repoRoot,
		"apps/web/.generated/pattern-skills.json",
	);

	assert.equal(manifest.patterns.length, 1);
	assert.equal(manifest.patterns[0].skillSlug, "tabs");
	assert.equal(
		manifest.patterns[0].url,
		"https://uxpatterns.dev/patterns/navigation/tabs",
	);
	assert.match(
		await fs.readFile(skillPath, "utf8"),
		/description: "Use when you need to switch between different views\."/,
	);
	assert.match(await fs.readFile(skillPath, "utf8"), /## What it solves/);
	assert.match(
		await fs.readFile(skillPath, "utf8"),
		/## Accessibility guardrails/,
	);
	assert.match(await fs.readFile(referencePath, "utf8"), /# Tabs/);
	assert.deepEqual(
		JSON.parse(await fs.readFile(manifestPath, "utf8")).patterns[0]
			.relatedPatternUrls,
		["https://uxpatterns.dev/patterns/content-management/accordion"],
	);
});

test("generatePatternSkills prefixes duplicate slugs by category", async () => {
	const repoRoot = await createTempRepo();

	await fs.mkdir(path.join(repoRoot, "apps/web/content/patterns/forms"), {
		recursive: true,
	});

	await fs.writeFile(
		path.join(repoRoot, "apps/web/content/patterns/navigation/button.mdx"),
		SAMPLE_PATTERN.replace(/Tabs/g, "Navigation Button"),
	);
	await fs.writeFile(
		path.join(repoRoot, "apps/web/content/patterns/forms/button.mdx"),
		SAMPLE_PATTERN.replace(/Tabs/g, "Form Button"),
	);

	const manifest = await generatePatternSkills({ repoRoot });
	const skillSlugs = manifest.patterns.map((item) => item.skillSlug).sort();

	assert.deepEqual(skillSlugs, ["forms-button", "navigation-button"]);
});

test("generatePatternSkills skips draft placeholder patterns", async () => {
	const repoRoot = await createTempRepo();
	const draftPath = path.join(
		repoRoot,
		"apps/web/content/patterns/navigation/activity-feed.mdx",
	);

	await fs.writeFile(
		draftPath,
		`---
title: "Activity Feed"
description: "Draft pattern"
status: draft
---

<Callout type="warning">
  This page is empty for now.
</Callout>
`,
	);

	const manifest = await generatePatternSkills({ repoRoot });

	assert.equal(manifest.patterns.length, 0);
	await assert.rejects(
		fs.stat(path.join(repoRoot, "skills/activity-feed")),
		/ENOENT/,
	);
});

test("targeted generation updates touched files and full generation cleans stale outputs", async () => {
	const repoRoot = await createTempRepo();
	const patternPath = path.join(
		repoRoot,
		"apps/web/content/patterns/navigation/tabs.mdx",
	);

	await fs.writeFile(patternPath, SAMPLE_PATTERN);
	await generatePatternSkills({ repoRoot });

	await fs.writeFile(
		patternPath,
		SAMPLE_PATTERN.replace("Switch between different views", "Updated summary"),
	);
	await generatePatternSkills({
		repoRoot,
		selectedFiles: ["apps/web/content/patterns/navigation/tabs.mdx"],
	});

	const manifestPath = path.join(
		repoRoot,
		"apps/web/.generated/pattern-skills.json",
	);
	assert.equal(
		JSON.parse(await fs.readFile(manifestPath, "utf8")).patterns[0].summary,
		"Updated summary",
	);

	await fs.rm(patternPath);
	await generatePatternSkills({ repoRoot });

	await assert.rejects(fs.stat(path.join(repoRoot, "skills/tabs")), /ENOENT/);
	assert.equal(
		JSON.parse(await fs.readFile(manifestPath, "utf8")).patterns.length,
		0,
	);
});

test("llms text builders include the full index pointer and skill metadata", () => {
	const indexText = buildLlmsIndexText([
		{
			slugs: ["patterns", "navigation", "tabs"],
			url: "/patterns/navigation/tabs",
			data: {
				title: "Tabs",
				description: "Create accessible tab interfaces.",
			},
		},
	]);

	assert.match(indexText, /llms-full\.txt/);

	const fullText = buildLlmsFullText({
		globalSkill: {
			skillSlug: "ux-patterns-global",
			installCommand:
				"npx skills add https://github.com/thedaviddias/ux-patterns-for-developers/tree/main/skills --skill ux-patterns-global",
		},
		patterns: [
			{
				category: "navigation",
				title: "Tabs",
				description: "Create accessible tab interfaces.",
				skillSlug: "tabs",
				installCommand:
					"npx skills add https://github.com/thedaviddias/ux-patterns-for-developers/tree/main/skills --skill tabs",
				url: "https://uxpatterns.dev/patterns/navigation/tabs",
				aliases: ["tabbed interface"],
				relatedPatternUrls: [
					"https://uxpatterns.dev/patterns/content-management/accordion",
				],
			},
		],
	});

	assert.match(fullText, /Skill: `tabs`/);
	assert.match(fullText, /Aliases: tabbed interface/);
	assert.match(fullText, /Reference: https:\/\/uxpatterns\.dev\/skills\/tabs/);
});
