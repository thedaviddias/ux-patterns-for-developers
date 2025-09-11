/**
 * Centralized route constants for the gallery application
 */

export const ROUTES = {
	// Base routes
	HOME: "/",
	SEARCH: "/search",
	EXPLORE: "/explore",

	// Platform routes
	WEB: "/web",
	MOBILE: "/mobile",

	// Dynamic route builders
	platform: (platform: "web" | "mobile") => `/${platform}` as const,

	category: (platform: "web" | "mobile", category: string) =>
		`/${platform}/${category}` as const,

	pattern: (platform: "web" | "mobile", category: string, pattern: string) =>
		`/${platform}/${category}/${pattern}` as const,

	quality: (
		platform: "web" | "mobile",
		category: string,
		pattern: string,
		quality: "do" | "dont",
	) => `/${platform}/${category}/${pattern}/${quality}` as const,

	// Website collections
	website: (website: string) => `/website/${website}` as const,

	websiteWithFilter: (website: string, filter: "do" | "dont" | string) =>
		`/website/${website}/${filter}` as const,

	// Legacy pattern routes (for backwards compatibility if needed)
	patternsLegacy: {
		base: "/patterns",
		platform: (platform: "web" | "mobile") => `/patterns/${platform}` as const,
		pattern: (platform: "web" | "mobile", pattern: string) =>
			`/patterns/${platform}/${pattern}` as const,
	},

	// Query parameter builders
	withQuery: (path: string, params: Record<string, string | undefined>) => {
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				searchParams.set(key, value);
			}
		});
		const queryString = searchParams.toString();
		return queryString ? `${path}?${queryString}` : path;
	},

	// Common query parameter patterns
	withQuality: (path: string, quality: "do" | "dont" | "all") => {
		if (quality === "all") return path;
		return ROUTES.withQuery(path, { quality });
	},

	withSearch: (path: string, search: string) => {
		if (!search) return path;
		return ROUTES.withQuery(path, { search });
	},

	withTags: (path: string, tags: string[]) => {
		if (!tags.length) return path;
		return ROUTES.withQuery(path, { tags: tags.join(",") });
	},

	withFilters: (
		path: string,
		filters: {
			quality?: "do" | "dont" | "all";
			search?: string;
			tags?: string[];
		},
	) => {
		const params: Record<string, string | undefined> = {};

		if (filters.quality && filters.quality !== "all") {
			params.quality = filters.quality;
		}
		if (filters.search) {
			params.search = filters.search;
		}
		if (filters.tags && filters.tags.length > 0) {
			params.tags = filters.tags.join(",");
		}

		return ROUTES.withQuery(path, params);
	},
} as const;

// Simplified route builders for common use cases
export const buildPatternRoute = (
	platform: "web" | "mobile",
	category?: string,
	pattern?: string,
	quality?: "do" | "dont",
) => {
	if (!category) return ROUTES.platform(platform);
	if (!pattern) return ROUTES.category(platform, category);
	if (!quality) return ROUTES.pattern(platform, category, pattern);
	return ROUTES.quality(platform, category, pattern, quality);
};

export const buildWebsiteRoute = (website: string, filter?: string) => {
	if (!filter) return ROUTES.website(website);
	return ROUTES.websiteWithFilter(website, filter);
};

// Helper to extract route params from pathname
export const parsePatternRoute = (pathname: string) => {
	const segments = pathname.split("/").filter(Boolean);

	// Skip non-pattern routes
	if (!segments[0] || !["web", "mobile"].includes(segments[0])) {
		return null;
	}

	return {
		platform: segments[0] as "web" | "mobile",
		category: segments[1],
		pattern: segments[2],
		quality: segments[3] as "do" | "dont" | undefined,
	};
};

// Helper to check if we're on a pattern route
export const isPatternRoute = (pathname: string): boolean => {
	return pathname.startsWith("/web") || pathname.startsWith("/mobile");
};

// Helper to check if we're on a website route
export const isWebsiteRoute = (pathname: string): boolean => {
	return pathname.startsWith("/website/");
};

// Get the current route type
export type RouteType =
	| "home"
	| "platform"
	| "category"
	| "pattern"
	| "quality"
	| "website"
	| "search"
	| "other";

export const getRouteType = (pathname: string): RouteType => {
	if (pathname === "/") return "home";
	if (pathname === "/search") return "search";
	if (isWebsiteRoute(pathname)) return "website";

	const parsed = parsePatternRoute(pathname);
	if (!parsed) return "other";

	if (parsed.quality) return "quality";
	if (parsed.pattern) return "pattern";
	if (parsed.category) return "category";
	if (parsed.platform) return "platform";

	return "other";
};
