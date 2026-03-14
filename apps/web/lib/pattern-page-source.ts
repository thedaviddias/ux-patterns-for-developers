type QuickDecisionData = {
	bestFor?: string[];
	avoidWhen?: string[];
	compareWith?: { name: string; href: string }[];
	complexity?: "low" | "medium" | "high";
	accessibilityRisk?: "low" | "medium" | "high";
};

type UseWithAIOptions = {
	patternTitle: string;
	patternSkillSlug: string;
	patternSkillInstallCommand: string;
	globalSkillSlug: string;
	globalSkillInstallCommand: string;
	markdownUrl: string;
};

function getSectionInsertAt(source: string, heading: string) {
	const sectionMatch = source.match(new RegExp(`^## ${heading}\\s*$`, "m"));

	if (!sectionMatch || sectionMatch.index === undefined) {
		return null;
	}

	const sectionStart = sectionMatch.index + sectionMatch[0].length;
	const remaining = source.slice(sectionStart);
	const nextSectionMatch = remaining.match(/\n##\s+/);

	if (!nextSectionMatch || nextSectionMatch.index === undefined) {
		return source.length;
	}

	return sectionStart + nextSectionMatch.index;
}

function serializeQuickDecisionProps(data: QuickDecisionData) {
	const props: string[] = [];

	if (data.bestFor && data.bestFor.length > 0) {
		props.push(`bestFor={${JSON.stringify(data.bestFor)}}`);
	}

	if (data.avoidWhen && data.avoidWhen.length > 0) {
		props.push(`avoidWhen={${JSON.stringify(data.avoidWhen)}}`);
	}

	if (data.compareWith && data.compareWith.length > 0) {
		props.push(`compareWith={${JSON.stringify(data.compareWith)}}`);
	}

	if (data.complexity) {
		props.push(`complexity=${JSON.stringify(data.complexity)}`);
	}

	if (data.accessibilityRisk) {
		props.push(`accessibilityRisk=${JSON.stringify(data.accessibilityRisk)}`);
	}

	return props.join(" ");
}

export function injectUseWithAIIntoOverview(
	source: string,
	options: UseWithAIOptions,
) {
	const serializedProps = [
		`patternTitle=${JSON.stringify(options.patternTitle)}`,
		`patternSkillSlug=${JSON.stringify(options.patternSkillSlug)}`,
		`patternSkillInstallCommand={${JSON.stringify(options.patternSkillInstallCommand)}}`,
		`globalSkillSlug=${JSON.stringify(options.globalSkillSlug)}`,
		`globalSkillInstallCommand={${JSON.stringify(options.globalSkillInstallCommand)}}`,
		`markdownUrl=${JSON.stringify(options.markdownUrl)}`,
	].join(" ");
	const insertion = `\n<UseWithAIDisclosure ${serializedProps} />\n`;
	const insertAt = getSectionInsertAt(source, "Overview");

	if (insertAt === null) {
		return `${source}${insertion}`;
	}
	return `${source.slice(0, insertAt)}${insertion}${source.slice(insertAt)}`;
}

export function injectQuickDecisionAfterSpecimen(
	source: string,
	data: QuickDecisionData,
) {
	const serializedProps = serializeQuickDecisionProps(data);
	if (!serializedProps) {
		return source;
	}

	const insertion = `\n<QuickDecisionBand ${serializedProps} />\n`;
	const overviewInsertAt = getSectionInsertAt(source, "Overview");

	if (overviewInsertAt !== null) {
		return `${source.slice(0, overviewInsertAt)}${insertion}${source.slice(
			overviewInsertAt,
		)}`;
	}

	const previewMatch = source.match(/<PatternPreview\b[\s\S]*?\/>/);

	if (previewMatch && previewMatch.index !== undefined) {
		const insertAt = previewMatch.index + previewMatch[0].length;
		return `${source.slice(0, insertAt)}${insertion}${source.slice(insertAt)}`;
	}

	return `${insertion}${source}`;
}

export function applyPatternPageSourceTransforms(
	source: string,
	options: {
		useWithAI?: UseWithAIOptions;
		quickDecision?: QuickDecisionData;
	},
) {
	let nextSource = source;

	if (options.quickDecision) {
		nextSource = injectQuickDecisionAfterSpecimen(
			nextSource,
			options.quickDecision,
		);
	}

	if (options.useWithAI) {
		nextSource = injectUseWithAIIntoOverview(nextSource, options.useWithAI);
	}

	return nextSource;
}
