import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import {
	findRepoRoot,
	getPatternSkillsManifestPath,
	getSkillInstallCommand,
	getSkillsDir,
	PATTERN_SKILLS_GLOBAL_SLUG,
	PATTERN_SKILLS_INSTALL_SOURCE,
	PATTERN_SKILLS_SITE_URL,
} from "../lib/pattern-skills-config.mjs";

function normalizeHeading(value) {
	return value
		.toLowerCase()
		.replace(/[`*_~]/g, "")
		.replace(/[^a-z0-9\s-]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function normalizePlainText(value) {
	return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function trimBlock(value) {
	return value.replace(/^\s+|\s+$/g, "");
}

function toggleFence(line, inFence) {
	if (line.trimStart().startsWith("```")) {
		return !inFence;
	}

	return inFence;
}

export function splitSections(markdown, level = 2) {
	const sections = new Map();
	const prefix = `${"#".repeat(level)} `;
	const lines = markdown.split("\n");
	let currentTitle = null;
	let buffer = [];
	let inFence = false;

	for (const line of lines) {
		inFence = toggleFence(line, inFence);

		if (!inFence && line.startsWith(prefix)) {
			if (currentTitle) {
				sections.set(currentTitle, trimBlock(buffer.join("\n")));
			}

			currentTitle = line.slice(prefix.length).trim();
			buffer = [];
			continue;
		}

		if (currentTitle) {
			buffer.push(line);
		}
	}

	if (currentTitle) {
		sections.set(currentTitle, trimBlock(buffer.join("\n")));
	}

	return sections;
}

function findSection(sections, candidates) {
	for (const [title, value] of sections.entries()) {
		const normalizedTitle = normalizeHeading(title);

		if (
			candidates.some((candidate) =>
				normalizedTitle.includes(normalizeHeading(candidate)),
			)
		) {
			return value;
		}
	}

	return "";
}

function stripJsComments(markdown) {
	return markdown.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
}

export function stripMdxToMarkdown(content) {
	return trimBlock(
		stripJsComments(content)
			.replace(/^(import|export)\s+.*$/gm, "")
			.replace(/<[A-Z][\w.:-]*[^>]*\/>/g, "")
			.replace(/<([A-Z][\w.:-]*)[^>]*>([\s\S]*?)<\/\1>/g, "$2")
			.replace(/<\/?[A-Z][\w.:-]*[^>]*>/g, "")
			.replace(/\n{3,}/g, "\n\n"),
	);
}

function isPatternEligible(frontmatter, rawBody) {
	const status = frontmatter.status ?? "complete";
	if (status === "draft" || status === "coming-soon") {
		return false;
	}

	const plainText = normalizePlainText(stripMdxToMarkdown(rawBody));
	const placeholderPhrases = [
		"this page is empty for now",
		"this page is a work in progress",
		"don't consider it complete yet",
	];

	return !placeholderPhrases.some((phrase) => plainText.includes(phrase));
}

function limitLines(block, maxLines = 10) {
	const sourceLines = trimBlock(block)
		.split("\n")
		.filter((line) => line.trim() && line.trim() !== "---");
	const lines = [];
	let inFence = false;

	for (const line of sourceLines) {
		if (lines.length >= maxLines && !inFence) {
			break;
		}

		lines.push(line);

		if (line.trimStart().startsWith("```")) {
			inFence = !inFence;
		}
	}

	return trimBlock(lines.join("\n")).replace(/(?:\n---)+$/g, "");
}

function extractUseCaseBlock(sectionContent, candidates) {
	if (!sectionContent) return "";

	const subsections = splitSections(sectionContent, 3);
	const match = findSection(subsections, candidates);

	if (match) return limitLines(stripMdxToMarkdown(match), 10);

	return "";
}

function extractCommonMistakesBlock(sectionContent, maxChunks = 3) {
	if (!sectionContent) return "";

	const markdown = stripMdxToMarkdown(sectionContent);
	const chunks = markdown
		.split(/\n\s*---+\s*\n/g)
		.map((chunk) => trimBlock(chunk))
		.filter(Boolean);

	return trimBlock(chunks.slice(0, maxChunks).join("\n\n"));
}

function extractRelatedPatternUrls(rawContent) {
	return [
		...new Set(rawContent.match(/\/patterns\/[a-z0-9-]+\/[a-z0-9-]+/gi) ?? []),
	]
		.map((routePath) => new URL(routePath, PATTERN_SKILLS_SITE_URL).toString())
		.sort();
}

function getPatternIdentityFromFile(patternsDir, filePath) {
	const relativePath = path.relative(patternsDir, filePath).replace(/\\/g, "/");
	const parts = relativePath.split("/");
	if (parts.length !== 2) {
		throw new Error(`Expected category pattern file, received ${relativePath}`);
	}

	const [category, fileName] = parts;
	const slug = fileName.replace(/\.mdx$/, "");
	const routePath = `/patterns/${category}/${slug}`;

	return {
		category,
		slug,
		patternSlug: `patterns/${category}/${slug}`,
		routePath,
		url: new URL(routePath, PATTERN_SKILLS_SITE_URL).toString(),
		sourcePath: `apps/web/content/patterns/${relativePath}`,
	};
}

function buildSkillDescription(frontmatter, title) {
	const summary = frontmatter.summary?.trim();
	const candidate =
		summary ||
		frontmatter.description?.split(/(?<=[.!?])\s+/)[0]?.trim() ||
		`implement ${title} UX pattern correctly in product interfaces`;

	if (candidate.trimStart().toLowerCase().startsWith("use when")) {
		return candidate.trim();
	}

	const cleaned = candidate
		.replace(/^learn how to\s+/i, "")
		.replace(/^discover\s+/i, "")
		.replace(/[.]+$/g, "")
		.trim();
	const lower = `${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
	const firstWord = lower.split(/\s+/)[0];
	const actionVerbs = new Set([
		"switch",
		"display",
		"trigger",
		"create",
		"validate",
		"organize",
		"inform",
		"search",
		"compare",
		"build",
		"manage",
		"upload",
		"choose",
		"configure",
		"stream",
		"track",
	]);

	if (actionVerbs.has(firstWord)) {
		return `Use when you need to ${lower}.`;
	}

	return `Use when implementing ${lower}.`;
}

function buildPerPatternSkill(pattern) {
	const lines = [
		"---",
		`name: ${pattern.skillSlug}`,
		`description: "${buildSkillDescription(pattern.frontmatter, pattern.title).replace(/"/g, "'")}"`,
		"metadata:",
		`  id: ${pattern.skillSlug}`,
		`  category: ${pattern.category}`,
		`  pattern: ${pattern.title.replace(/"/g, "'")}`,
		"  source: uxpatterns.dev",
		`  url: ${pattern.url}`,
		`  sourcePath: ${pattern.sourcePath}`,
		"---",
		"",
		`# ${pattern.title}`,
		"",
	];

	if (pattern.summary) {
		lines.push(pattern.summary, "");
	}

	if (pattern.whatItSolves) {
		lines.push("## What it solves", "", pattern.whatItSolves, "");
	}

	if (pattern.whenToUse) {
		lines.push("## When to use", "", pattern.whenToUse, "");
	}

	if (pattern.whenNotToUse) {
		lines.push("## When to avoid", "", pattern.whenNotToUse, "");
	}

	lines.push(
		"## Implementation workflow",
		"",
		"1. Confirm the pattern matches the problem and constraints before copying the example.",
		"2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.",
		"3. Apply accessibility, performance, and interaction guardrails before layering visual polish.",
		"4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.",
		"",
	);

	if (pattern.accessibility) {
		lines.push("## Accessibility guardrails", "", pattern.accessibility, "");
	}

	if (pattern.performance) {
		lines.push("## Performance guardrails", "", pattern.performance, "");
	}

	if (pattern.commonMistakes) {
		lines.push("## Common mistakes", "", pattern.commonMistakes, "");
	}

	if (pattern.relatedPatternUrls.length > 0) {
		lines.push("## Related patterns", "");
		for (const relatedUrl of pattern.relatedPatternUrls) {
			lines.push(`- ${relatedUrl}`);
		}
		lines.push("");
	}

	lines.push(
		"---",
		"",
		"For full implementation detail, examples, and testing notes, see `references/pattern.md`.",
		"",
		`Pattern page: ${pattern.url}`,
		"",
	);

	return lines.join("\n");
}

function buildPatternReference(pattern) {
	const lines = [
		`# ${pattern.title}`,
		"",
		`> ${pattern.description || pattern.summary || pattern.title}`,
		"",
		`**URL:** ${pattern.url}`,
		`**Source:** ${pattern.sourcePath}`,
		"",
		"---",
		"",
		stripMdxToMarkdown(pattern.rawBody),
		"",
	];

	return lines.join("\n");
}

function buildGlobalSkill(patterns) {
	const categoryCounts = new Map();

	for (const pattern of patterns) {
		categoryCounts.set(
			pattern.category,
			(categoryCounts.get(pattern.category) ?? 0) + 1,
		);
	}

	const lines = [
		"---",
		`name: ${PATTERN_SKILLS_GLOBAL_SLUG}`,
		'description: "Use when choosing, comparing, or implementing UX patterns across the UX Patterns for Developers corpus."',
		"metadata:",
		`  id: ${PATTERN_SKILLS_GLOBAL_SLUG}`,
		"  category: global",
		"  source: uxpatterns.dev",
		`  url: ${PATTERN_SKILLS_SITE_URL}/skills/${PATTERN_SKILLS_GLOBAL_SLUG}`,
		"---",
		"",
		"# UX Patterns Global",
		"",
		`This skill aggregates ${patterns.length} UX patterns across the site and helps choose the right implementation path without guessing from memory.`,
		"",
		"## Workflow",
		"",
		"1. Start with the user problem, task flow, and constraints instead of jumping straight to a component.",
		"2. Narrow candidate patterns by category, aliases, and related-pattern links.",
		"3. Compare tradeoffs before implementation when multiple patterns could fit.",
		"4. Install the specific pattern skill once the direction is clear, then implement from its reference file.",
		"5. Validate accessibility, performance, and testing guidance before shipping.",
		"",
		"## Coverage",
		"",
	];

	for (const [category, count] of [...categoryCounts.entries()].sort(
		(left, right) => left[0].localeCompare(right[0]),
	)) {
		lines.push(`- ${category}: ${count} patterns`);
	}

	lines.push(
		"",
		"---",
		"",
		"See `references/categories.md` for the pattern-by-category index.",
		"",
		`Site index: ${PATTERN_SKILLS_SITE_URL}/llms-full.txt`,
		"",
	);

	return lines.join("\n");
}

function buildGlobalReference(patterns) {
	const byCategory = new Map();

	for (const pattern of patterns) {
		const list = byCategory.get(pattern.category) ?? [];
		list.push(pattern);
		byCategory.set(pattern.category, list);
	}

	const lines = [
		"# UX Patterns Global Reference",
		"",
		"This category index maps installable pattern skills back to their canonical docs.",
		"",
	];

	for (const category of [...byCategory.keys()].sort()) {
		lines.push(`## ${category}`, "");

		for (const pattern of byCategory
			.get(category)
			.sort((left, right) => left.title.localeCompare(right.title))) {
			lines.push(
				`- **${pattern.title}**`,
				`  - URL: ${pattern.url}`,
				`  - Skill: ${pattern.skillSlug}`,
				`  - Install: \`${getSkillInstallCommand(pattern.skillSlug)}\``,
			);
		}

		lines.push("");
	}

	return lines.join("\n");
}

async function createPatternRecord(filePath, patternsDir, slugCounts) {
	const rawFile = await fs.readFile(filePath, "utf8");
	const { data, content } = matter(rawFile);
	const identity = getPatternIdentityFromFile(patternsDir, filePath);
	const sections = splitSections(content, 2);
	const baseSkillSlug = identity.slug;
	const skillSlug =
		(slugCounts.get(baseSkillSlug) ?? 0) > 1
			? `${identity.category}-${identity.slug}`
			: baseSkillSlug;

	const useCasesSection = findSection(sections, ["use cases", "usage"]);
	const bestPracticesSection = findSection(sections, ["best practices"]);

	return {
		skillSlug,
		category: identity.category,
		title: data.title,
		summary: data.summary,
		description: data.description,
		aliases: Array.isArray(data.aliases) ? data.aliases : [],
		url: identity.url,
		patternSlug: identity.patternSlug,
		sourcePath: identity.sourcePath,
		referencePath: `skills/${skillSlug}/references/pattern.md`,
		installCommand: getSkillInstallCommand(skillSlug),
		relatedPatternUrls: extractRelatedPatternUrls(content),
		rawBody: content,
		frontmatter: data,
		whatItSolves: limitLines(
			stripMdxToMarkdown(findSection(sections, ["overview"])),
			12,
		),
		whenToUse: extractUseCaseBlock(useCasesSection, ["when to use"]),
		whenNotToUse: extractUseCaseBlock(useCasesSection, ["when not to use"]),
		accessibility: limitLines(
			stripMdxToMarkdown(
				findSection(sections, ["accessibility"]) ||
					findSection(
						bestPracticesSection
							? splitSections(bestPracticesSection, 3)
							: new Map(),
						["accessibility"],
					),
			),
			10,
		),
		performance: limitLines(
			stripMdxToMarkdown(findSection(sections, ["performance"])),
			10,
		),
		commonMistakes: extractCommonMistakesBlock(
			findSection(sections, ["common mistakes", "anti patterns"]),
			3,
		),
	};
}

function loadExistingManifest(manifestPath) {
	return fs
		.readFile(manifestPath, "utf8")
		.then((contents) => JSON.parse(contents))
		.catch(() => null);
}

async function ensureDir(dirPath) {
	await fs.mkdir(dirPath, { recursive: true });
}

async function writeFile(filePath, contents) {
	await ensureDir(path.dirname(filePath));
	await fs.writeFile(filePath, contents);
}

async function removeDirIfExists(dirPath) {
	await fs.rm(dirPath, { recursive: true, force: true });
}

function getDeletedPatternSlugFromFile(
	patternsDir,
	filePath,
	existingManifest,
) {
	const identity = getPatternIdentityFromFile(patternsDir, filePath);
	return existingManifest?.patterns?.find(
		(item) => item.patternSlug === identity.patternSlug,
	);
}

export async function generatePatternSkills(options = {}) {
	const repoRoot = options.repoRoot ?? findRepoRoot();
	const patternsDir =
		options.patternsDir ?? path.join(repoRoot, "apps/web/content/patterns");
	const skillsDir = options.skillsDir ?? getSkillsDir(repoRoot);
	const manifestPath =
		options.manifestPath ?? getPatternSkillsManifestPath(repoRoot);
	const selectedFiles = (options.selectedFiles ?? []).map((filePath) =>
		path.isAbsolute(filePath) ? filePath : path.resolve(repoRoot, filePath),
	);
	const isFullGeneration = selectedFiles.length === 0;
	const allPatternFiles = (
		await fg("**/*.mdx", {
			cwd: patternsDir,
			absolute: true,
			onlyFiles: true,
		})
	)
		.filter(
			(filePath) =>
				path.relative(patternsDir, filePath).split(path.sep).length === 2,
		)
		.sort();
	const slugCounts = new Map();

	for (const filePath of allPatternFiles) {
		const { slug } = getPatternIdentityFromFile(patternsDir, filePath);
		slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1);
	}

	const existingManifest = await loadExistingManifest(manifestPath);
	const deletedSelections = selectedFiles.filter(
		(filePath) => !allPatternFiles.includes(filePath),
	);
	const filesToGenerate = isFullGeneration
		? allPatternFiles
		: selectedFiles.filter((filePath) => allPatternFiles.includes(filePath));
	const generatedPatterns = [];

	for (const filePath of filesToGenerate) {
		const rawFile = await fs.readFile(filePath, "utf8");
		const { data, content } = matter(rawFile);

		if (!isPatternEligible(data, content)) {
			continue;
		}

		generatedPatterns.push(
			await createPatternRecord(filePath, patternsDir, slugCounts),
		);
	}

	let patterns;

	if (isFullGeneration || !existingManifest) {
		patterns = generatedPatterns;
	} else {
		const untouchedPatterns = existingManifest.patterns.filter(
			(existingPattern) =>
				!generatedPatterns.some(
					(generatedPattern) =>
						generatedPattern.patternSlug === existingPattern.patternSlug,
				) &&
				!deletedSelections.some((deletedFile) => {
					const removed = getDeletedPatternSlugFromFile(
						patternsDir,
						deletedFile,
						existingManifest,
					);
					return removed?.patternSlug === existingPattern.patternSlug;
				}),
		);

		patterns = [...untouchedPatterns, ...generatedPatterns].sort(
			(left, right) => left.url.localeCompare(right.url),
		);
	}

	const globalSkill = {
		skillSlug: PATTERN_SKILLS_GLOBAL_SLUG,
		title: "UX Patterns Global",
		description:
			"Use when choosing, comparing, or implementing UX patterns across the UX Patterns for Developers corpus.",
		url: `${PATTERN_SKILLS_SITE_URL}/skills/${PATTERN_SKILLS_GLOBAL_SLUG}`,
		referencePath: `skills/${PATTERN_SKILLS_GLOBAL_SLUG}/references/categories.md`,
		installCommand: getSkillInstallCommand(PATTERN_SKILLS_GLOBAL_SLUG),
	};
	const generatedAt = existingManifest?.generatedAt ?? new Date().toISOString();

	const manifest = {
		generatedAt,
		installSource: PATTERN_SKILLS_INSTALL_SOURCE,
		globalSkill,
		patterns: patterns.map((pattern) => ({
			skillSlug: pattern.skillSlug,
			patternSlug: pattern.patternSlug,
			category: pattern.category,
			title: pattern.title,
			summary: pattern.summary,
			description: pattern.description,
			aliases: pattern.aliases,
			url: pattern.url,
			sourcePath: pattern.sourcePath,
			referencePath: pattern.referencePath,
			installCommand: pattern.installCommand,
			relatedPatternUrls: pattern.relatedPatternUrls,
		})),
	};

	if (isFullGeneration && existingManifest?.patterns) {
		for (const oldPattern of existingManifest.patterns) {
			if (
				!manifest.patterns.some(
					(pattern) => pattern.patternSlug === oldPattern.patternSlug,
				)
			) {
				await removeDirIfExists(path.join(skillsDir, oldPattern.skillSlug));
			}
		}
	}

	for (const deletedFile of deletedSelections) {
		const removedPattern = getDeletedPatternSlugFromFile(
			patternsDir,
			deletedFile,
			existingManifest,
		);
		if (removedPattern) {
			await removeDirIfExists(path.join(skillsDir, removedPattern.skillSlug));
		}
	}

	for (const pattern of patterns) {
		const skillDir = path.join(skillsDir, pattern.skillSlug);
		await writeFile(
			path.join(skillDir, "SKILL.md"),
			buildPerPatternSkill(pattern),
		);
		await writeFile(
			path.join(skillDir, "references/pattern.md"),
			buildPatternReference(pattern),
		);
	}

	const globalSkillDir = path.join(skillsDir, PATTERN_SKILLS_GLOBAL_SLUG);
	await writeFile(
		path.join(globalSkillDir, "SKILL.md"),
		buildGlobalSkill(patterns),
	);
	await writeFile(
		path.join(globalSkillDir, "references/categories.md"),
		buildGlobalReference(patterns),
	);
	await writeFile(`${manifestPath}`, `${JSON.stringify(manifest, null, 2)}\n`);

	return manifest;
}
