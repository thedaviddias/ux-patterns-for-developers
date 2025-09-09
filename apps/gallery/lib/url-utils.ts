// URL utilities for the gallery routing system

export interface FilterParams {
	platform?: "web" | "mobile";
	category?: string;
	pattern?: string;
	quality?: "do" | "dont" | "all";
	website?: string;
	tags?: string[];
	search?: string;
}

// Pattern categories mapping
export const PATTERN_CATEGORIES = {
	forms: [
		"button",
		"text-field",
		"checkbox",
		"radio-button",
		"select",
		"toggle",
		"slider",
		"date-picker",
		"file-upload",
		"validation",
	],
	navigation: [
		"navbar",
		"sidebar",
		"tab-bar",
		"breadcrumb",
		"pagination",
		"stepper",
		"menu",
		"back-button",
		"load-more",
		"back-to-top",
	],
	"data-display": [
		"table",
		"list",
		"card",
		"accordion",
		"carousel",
		"timeline",
		"stats",
		"chart",
		"badge",
		"tag",
	],
	feedback: [
		"alert",
		"toast",
		"modal",
		"popover",
		"tooltip",
		"progress",
		"skeleton",
		"loading",
		"spinner",
		"notification",
	],
	content: [
		"hero",
		"feature",
		"testimonial",
		"pricing",
		"faq",
		"cta",
		"footer",
		"header",
		"banner",
		"empty-state",
	],
	"user-input": [
		"search",
		"filter",
		"sort",
		"autocomplete",
		"command-palette",
		"emoji-picker",
		"color-picker",
		"rating",
		"otp-input",
	],
} as const;

export type PatternCategory = keyof typeof PATTERN_CATEGORIES;
export type Pattern = (typeof PATTERN_CATEGORIES)[PatternCategory][number];

// Generate clean URL from filters
export function generateCleanUrl(filters: FilterParams): string {
	const segments = [];

	// Platform is required for clean URLs
	if (!filters.platform) {
		return "/";
	}

	segments.push(filters.platform);

	// Add category if present
	if (filters.category) {
		segments.push(filters.category);

		// Add pattern if category exists
		if (filters.pattern) {
			segments.push(filters.pattern);

			// Add quality if pattern exists
			if (filters.quality && filters.quality !== "all") {
				segments.push(filters.quality);
			}
		}
	}

	// Build URL
	const path = `/${segments.join("/")}`;

	// Add query params for additional filters
	const params = new URLSearchParams();
	if (filters.tags?.length) {
		params.set("tags", filters.tags.join(","));
	}
	if (filters.search) {
		params.set("search", filters.search);
	}
	// Add quality as query param if not in path
	if (filters.quality && filters.quality !== "all" && !filters.pattern) {
		params.set("quality", filters.quality);
	}

	const queryString = params.toString();
	return queryString ? `${path}?${queryString}` : path;
}

// Generate URL with query parameters
export function generateQueryUrl(base: string, filters: FilterParams): string {
	const params = new URLSearchParams();

	if (filters.platform) {
		params.set("platform", filters.platform);
	}
	if (filters.category) {
		params.set("category", filters.category);
	}
	if (filters.pattern) {
		params.set("pattern", filters.pattern);
	}
	if (filters.quality && filters.quality !== "all") {
		params.set("quality", filters.quality);
	}
	if (filters.tags?.length) {
		params.set("tags", filters.tags.join(","));
	}
	if (filters.search) {
		params.set("search", filters.search);
	}

	const queryString = params.toString();
	return queryString ? `${base}?${queryString}` : base;
}

// Parse URL into filters
export function parseUrlToFilters(
	pathname: string,
	searchParams: URLSearchParams,
): FilterParams {
	const filters: FilterParams = {};
	const segments = pathname.split("/").filter(Boolean);

	// Skip if starts with other routes
	if (
		["website", "search", "explore", "trending", "collections"].includes(
			segments[0],
		)
	) {
		// Handle special routes
		if (segments[0] === "website" && segments[1]) {
			filters.website = segments[1];
		}
		return parseQueryParams(filters, searchParams);
	}

	// Parse platform-based routes
	if (segments[0] && ["web", "mobile"].includes(segments[0])) {
		filters.platform = segments[0] as "web" | "mobile";

		if (segments[1]) {
			// Check if it's a category or a pattern
			if (isCategorySlug(segments[1])) {
				filters.category = segments[1];

				if (segments[2]) {
					filters.pattern = segments[2];

					if (segments[3] && ["do", "dont"].includes(segments[3])) {
						filters.quality = segments[3] as "do" | "dont";
					}
				}
			} else {
				// Might be a direct pattern without category (legacy support)
				filters.pattern = segments[1];

				if (segments[2] && ["do", "dont"].includes(segments[2])) {
					filters.quality = segments[2] as "do" | "dont";
				}
			}
		}
	}

	// Parse query parameters and merge with path-based filters
	return parseQueryParams(filters, searchParams);
}

// Helper to parse query parameters
function parseQueryParams(
	filters: FilterParams,
	searchParams: URLSearchParams,
): FilterParams {
	// Quality can be overridden by query param
	const quality = searchParams.get("quality");
	if (quality && ["do", "dont", "all"].includes(quality) && !filters.quality) {
		filters.quality = quality as FilterParams["quality"];
	}

	const tags = searchParams.get("tags");
	if (tags) {
		filters.tags = tags.split(",").map((t) => t.trim());
	}

	const search = searchParams.get("search") || searchParams.get("q");
	if (search) {
		filters.search = search;
	}

	return filters;
}

// Helper to determine if a slug is a category
export function isCategorySlug(slug: string): boolean {
	return Object.keys(PATTERN_CATEGORIES).includes(slug);
}

// Get category for a pattern
export function getCategoryForPattern(pattern: string): PatternCategory | null {
	const normalizedPattern = pattern.toLowerCase().replace(/\s+/g, "-");

	for (const [category, patterns] of Object.entries(PATTERN_CATEGORIES)) {
		if (patterns.some((p) => p === normalizedPattern)) {
			return category as PatternCategory;
		}
	}

	return null;
}

// Generate canonical URL
export function getCanonicalUrl(
	filters: FilterParams,
	baseUrl: string = "https://gallery.uxpatterns.dev",
): string {
	const path = generateCleanUrl(filters);
	return `${baseUrl}${path}`;
}

// Convert to website collection URL
export function generateWebsiteUrl(
	website: string,
	filters?: Partial<FilterParams>,
): string {
	const segments = ["website", website.toLowerCase().replace(/\s+/g, "-")];

	if (filters?.category) {
		segments.push(filters.category);
	} else if (filters?.pattern) {
		segments.push(filters.pattern);
	} else if (filters?.quality && filters.quality !== "all") {
		segments.push(filters.quality);
	}

	return `/${segments.join("/")}`;
}

// Convert pattern name to slug
export function patternToSlug(pattern: string): string {
	return pattern.toLowerCase().replace(/\s+/g, "-");
}

// Convert slug to pattern name
export function slugToPattern(slug: string): string {
	return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

// Get all patterns for a category
export function getPatternsForCategory(category: PatternCategory): string[] {
	return [...(PATTERN_CATEGORIES[category] || [])];
}

// Get all categories
export function getAllCategories(): PatternCategory[] {
	return Object.keys(PATTERN_CATEGORIES) as PatternCategory[];
}

// Check if pattern exists in any category
export function isValidPattern(pattern: string): boolean {
	const normalizedPattern = pattern.toLowerCase().replace(/\s+/g, "-");
	return Object.values(PATTERN_CATEGORIES)
		.flat()
		.includes(normalizedPattern as any);
}

// Build breadcrumb items from current filters
export interface BreadcrumbItem {
	label: string;
	href: string;
}

export function buildBreadcrumbs(filters: FilterParams): BreadcrumbItem[] {
	const items: BreadcrumbItem[] = [{ label: "Gallery", href: "/" }];

	if (filters.platform) {
		items.push({
			label: filters.platform === "web" ? "Web" : "Mobile",
			href: `/${filters.platform}`,
		});

		if (filters.category) {
			items.push({
				label: slugToPattern(filters.category),
				href: `/${filters.platform}/${filters.category}`,
			});

			if (filters.pattern) {
				items.push({
					label: slugToPattern(filters.pattern),
					href: `/${filters.platform}/${filters.category}/${filters.pattern}`,
				});

				if (filters.quality && filters.quality !== "all") {
					items.push({
						label: filters.quality === "do" ? "Do" : "Don't",
						href: `/${filters.platform}/${filters.category}/${filters.pattern}/${filters.quality}`,
					});
				}
			}
		}
	}

	return items;
}

// Convert current path to alternate platform URL
export function getAlternatePlatformUrl(
	currentPath: string,
	targetPlatform: "web" | "mobile",
): string {
	const segments = currentPath.split("/").filter(Boolean);

	if (segments[0] && ["web", "mobile"].includes(segments[0])) {
		segments[0] = targetPlatform;
		return `/${segments.join("/")}`;
	}

	return `/${targetPlatform}`;
}

// Get related patterns for a given pattern
export function getRelatedPatterns(pattern: string): string[] {
	const category = getCategoryForPattern(pattern);
	if (!category) return [];

	const normalizedPattern = pattern.toLowerCase().replace(/\s+/g, "-");
	return PATTERN_CATEGORIES[category]
		.filter((p) => p !== normalizedPattern)
		.slice(0, 5); // Return up to 5 related patterns
}
