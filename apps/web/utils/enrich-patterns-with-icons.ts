import { source } from "../lib/source";

/** Mirrors the velite `patternStatus` enum. */
type PatternStatus = "complete" | "draft" | "coming-soon" | "published";

// Function to get pattern data from source
function getPatternFromSource(path: string) {
	const page = source.getPage(path.split("/").filter(Boolean));
	if (!page) return null;

	// Cast to any to access custom frontmatter fields
	const pageData = page.data as any;
	const iconName = pageData.icon as string;
	return {
		title: pageData.title as string,
		description: pageData.description as string,
		icon: iconName || undefined,
		status: pageData.status as PatternStatus | undefined,
		publishedAt: pageData.publishedAt as string | undefined,
		lastMajorUpdate: pageData.lastMajorUpdate as string | undefined,
		createdAt: pageData.createdAt as string | undefined,
		updatedAt: pageData.updatedAt as string | undefined,
		// Git-derived, injected by velite. Resolved here on the server so the
		// client card never has to touch the filesystem for them.
		gitCreated: pageData.gitCreated as string | undefined,
		gitUpdated: pageData.gitUpdated as string | undefined,
	};
}

export type EnrichedPattern = {
	title: string;
	path: string;
	description?: string;
	category?: string;
	icon?: string; // Icon name as string instead of component
	status?: PatternStatus;
	publishedAt?: string;
	lastMajorUpdate?: string;
	createdAt?: string;
	updatedAt?: string;
	gitCreated?: string;
	gitUpdated?: string;
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
			gitCreated: sourceData?.gitCreated,
			gitUpdated: sourceData?.gitUpdated,
		};
	});
}
