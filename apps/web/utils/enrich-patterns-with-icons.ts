import { source } from "../lib/source";

// Function to get pattern data from source
function getPatternFromSource(path: string) {
	const page = source.getPage(path.split("/").filter(Boolean));
	if (!page) return null;

	const iconName = page.data.icon as string;
	return {
		title: page.data.title as string,
		description: page.data.description as string,
		icon: iconName || undefined,
	};
}

export type EnrichedPattern = {
	title: string;
	path: string;
	description?: string;
	category?: string;
	icon?: string; // Icon name as string instead of component
};

// Function to enrich patterns with data from source (including icons)
export function enrichPatternsWithIcons(
	patterns: Array<{
		title: string;
		path: string;
		description?: string;
		category?: string;
	}>,
): EnrichedPattern[] {
	return patterns.map((pattern) => {
		// Try to get pattern data from source (including icon)
		const sourceData = getPatternFromSource(pattern.path);
		return {
			...pattern,
			title: sourceData?.title || pattern.title,
			description: sourceData?.description || pattern.description,
			icon: sourceData?.icon,
		};
	});
}
