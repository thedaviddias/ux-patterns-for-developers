import {
	getSkillReferenceUrl,
	PATTERN_SKILLS_GLOBAL_SLUG,
	PATTERN_SKILLS_SITE_URL,
} from "./pattern-skills-shared.mjs";

function absoluteUrl(pathname) {
	return new URL(pathname, PATTERN_SKILLS_SITE_URL).toString();
}

export function buildLlmsIndexText(pages) {
	const scanned = [
		"# UX Patterns for Developers",
		"",
		`- [llms-full.txt](${absoluteUrl("/llms-full.txt")}): Expanded AI-friendly index with per-pattern skills, install commands, and reference links.`,
	];
	const map = new Map();

	for (const page of pages) {
		if (page.slugs[0] === "blog" || page.slugs[0] === "pages") {
			continue;
		}

		const dir = page.slugs[0];
		const list = map.get(dir) ?? [];
		list.push(
			`- [${page.data.title}](${page.url}): ${page.data.description ?? ""}`,
		);
		map.set(dir, list);
	}

	const sectionOrder = ["pattern-guide", "patterns", "glossary"];

	for (const key of sectionOrder) {
		if (!map.has(key)) continue;
		scanned.push("", `## ${key}`);
		scanned.push(map.get(key).join("\n"));
	}

	for (const [key, value] of map) {
		if (sectionOrder.includes(key)) continue;
		scanned.push("", `## ${key}`);
		scanned.push(value.join("\n"));
	}

	return scanned.join("\n");
}

export function buildLlmsFullText(manifest) {
	const lines = [
		"# UX Patterns for Developers",
		"",
		`- Global skill: \`${manifest.globalSkill.skillSlug}\``,
		`- Install global skill: \`${manifest.globalSkill.installCommand}\``,
		`- Global reference: ${absoluteUrl(getSkillReferenceUrl(PATTERN_SKILLS_GLOBAL_SLUG))}`,
		"",
		"## Pattern skills",
	];

	const byCategory = new Map();

	for (const item of manifest.patterns) {
		const list = byCategory.get(item.category) ?? [];
		list.push(item);
		byCategory.set(item.category, list);
	}

	for (const category of [...byCategory.keys()].sort()) {
		lines.push("", `### ${category}`);

		for (const item of byCategory
			.get(category)
			.sort((left, right) => left.title.localeCompare(right.title))) {
			const aliases =
				item.aliases.length > 0 ? ` Aliases: ${item.aliases.join(", ")}.` : "";
			const related =
				item.relatedPatternUrls.length > 0
					? ` Related: ${item.relatedPatternUrls.join(", ")}.`
					: "";

			lines.push(
				`- [${item.title}](${absoluteUrl(item.url)}): ${item.description ?? item.summary ?? ""} Skill: \`${item.skillSlug}\`. Install: \`${item.installCommand}\`. Reference: ${absoluteUrl(getSkillReferenceUrl(item.skillSlug))}.${aliases}${related}`,
			);
		}
	}

	return lines.join("\n");
}
