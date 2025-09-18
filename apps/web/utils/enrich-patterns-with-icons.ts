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
		status: page.data.status as string | undefined,
		publishedAt: page.data.publishedAt as string | undefined,
		lastMajorUpdate: page.data.lastMajorUpdate as string | undefined,
		createdAt: page.data.createdAt as string | undefined,
		updatedAt: page.data.updatedAt as string | undefined,
	};
}

export type EnrichedPattern = {
	title: string;
	path: string;
	description?: string;
	category?: string;
	icon?: string; // Icon name as string instead of component
	status?: string;
	publishedAt?: string;
	lastMajorUpdate?: string;
	createdAt?: string;
	updatedAt?: string;
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
			status: sourceData?.status,
			publishedAt: sourceData?.publishedAt,
			lastMajorUpdate: sourceData?.lastMajorUpdate,
			createdAt: sourceData?.createdAt,
			updatedAt: sourceData?.updatedAt,
		};
	});
}
