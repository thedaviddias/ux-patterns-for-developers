import type { MetadataRoute } from "next";
import type { SitemapEntry } from "./types";

/**
 * Sitemap builder for Next.js apps
 */
export class SitemapBuilder {
	private entries: SitemapEntry[] = [];
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
	}

	/**
	 * Add a single entry to the sitemap
	 */
	add(entry: SitemapEntry | string): this {
		if (typeof entry === "string") {
			this.entries.push({
				url: this.normalizeUrl(entry),
				lastModified: new Date(),
				changeFrequency: "monthly",
				priority: 0.5,
			});
		} else {
			this.entries.push({
				...entry,
				url: this.normalizeUrl(entry.url),
			});
		}
		return this;
	}

	/**
	 * Add multiple entries to the sitemap
	 */
	addMany(entries: (SitemapEntry | string)[]): this {
		for (const entry of entries) {
			this.add(entry);
		}
		return this;
	}

	/**
	 * Add static pages with default settings
	 */
	addStaticPages(pages: string[], options: Partial<SitemapEntry> = {}): this {
		pages.forEach((page) => {
			this.add({
				url: page,
				lastModified: new Date(),
				changeFrequency: options.changeFrequency || "monthly",
				priority: options.priority || (page === "" || page === "/" ? 1.0 : 0.7),
				...options,
			});
		});
		return this;
	}

	/**
	 * Add dynamic pages with custom priority and change frequency
	 */
	addDynamicPages(
		pages: string[],
		getPriority: (path: string) => number,
		getChangeFrequency: (path: string) => SitemapEntry["changeFrequency"],
	): this {
		pages.forEach((page) => {
			this.add({
				url: page,
				lastModified: new Date(),
				changeFrequency: getChangeFrequency(page),
				priority: getPriority(page),
			});
		});
		return this;
	}

	/**
	 * Build the sitemap
	 */
	build(): MetadataRoute.Sitemap {
		return this.entries.map((entry) => ({
			url: entry.url,
			lastModified: entry.lastModified,
			changeFrequency: entry.changeFrequency,
			priority: entry.priority,
		}));
	}

	/**
	 * Get raw entries
	 */
	getEntries(): SitemapEntry[] {
		return this.entries;
	}

	/**
	 * Clear all entries
	 */
	clear(): this {
		this.entries = [];
		return this;
	}

	/**
	 * Filter entries
	 */
	filter(predicate: (entry: SitemapEntry) => boolean): this {
		this.entries = this.entries.filter(predicate);
		return this;
	}

	/**
	 * Sort entries
	 */
	sort(compareFn?: (a: SitemapEntry, b: SitemapEntry) => number): this {
		this.entries.sort(
			compareFn ||
				((a, b) => {
					// Default sort: by priority (desc) then by URL (asc)
					const priorityDiff = (b.priority || 0) - (a.priority || 0);
					if (priorityDiff !== 0) return priorityDiff;
					return a.url.localeCompare(b.url);
				}),
		);
		return this;
	}

	private normalizeUrl(url: string): string {
		// If it's already a full URL, return as is
		if (url.startsWith("http://") || url.startsWith("https://")) {
			return url;
		}

		// Remove leading slash if present
		const path = url.startsWith("/") ? url : `/${url}`;

		// Return full URL
		return `${this.baseUrl}${path === "/" ? "" : path}`;
	}
}

/**
 * Helper function to generate sitemap from content structure
 */
export function generateSitemapFromContent(
	baseUrl: string,
	contentPaths: string[],
	options: {
		staticPages?: string[];
		getPriority?: (path: string) => number;
		getChangeFrequency?: (path: string) => SitemapEntry["changeFrequency"];
	} = {},
): MetadataRoute.Sitemap {
	const builder = new SitemapBuilder(baseUrl);

	// Add static pages
	if (options.staticPages) {
		builder.addStaticPages(options.staticPages);
	}

	// Add content pages
	const defaultGetPriority = (path: string): number => {
		if (!path || path === "/") return 1.0;
		const depth = path.split("/").filter(Boolean).length;
		return Math.max(0.3, 1.0 - depth * 0.1);
	};

	const defaultGetChangeFrequency = (
		path: string,
	): SitemapEntry["changeFrequency"] => {
		if (path.includes("blog")) return "weekly";
		if (path.includes("docs") || path.includes("guide")) return "weekly";
		return "monthly";
	};

	builder.addDynamicPages(
		contentPaths,
		options.getPriority || defaultGetPriority,
		options.getChangeFrequency || defaultGetChangeFrequency,
	);

	return builder.sort().build();
}

/**
 * Priority calculator based on path patterns
 */
export class PriorityCalculator {
	private rules: Array<{
		pattern: RegExp | string;
		priority: number;
	}> = [];
	private defaultPriority: number = 0.5;

	/**
	 * Add a priority rule
	 */
	addRule(pattern: RegExp | string, priority: number): this {
		this.rules.push({ pattern, priority });
		return this;
	}

	/**
	 * Set default priority
	 */
	setDefault(priority: number): this {
		this.defaultPriority = priority;
		return this;
	}

	/**
	 * Calculate priority for a path
	 */
	calculate(path: string): number {
		// Check each rule in order
		for (const rule of this.rules) {
			const pattern = rule.pattern;
			if (typeof pattern === "string") {
				if (path.includes(pattern)) {
					return rule.priority;
				}
			} else if (pattern.test(path)) {
				return rule.priority;
			}
		}

		// Return default if no rules match
		return this.defaultPriority;
	}
}

/**
 * Change frequency calculator based on path patterns
 */
export class ChangeFrequencyCalculator {
	private rules: Array<{
		pattern: RegExp | string;
		frequency: SitemapEntry["changeFrequency"];
	}> = [];
	private defaultFrequency: SitemapEntry["changeFrequency"] = "monthly";

	/**
	 * Add a frequency rule
	 */
	addRule(
		pattern: RegExp | string,
		frequency: SitemapEntry["changeFrequency"],
	): this {
		this.rules.push({ pattern, frequency });
		return this;
	}

	/**
	 * Set default frequency
	 */
	setDefault(frequency: SitemapEntry["changeFrequency"]): this {
		this.defaultFrequency = frequency;
		return this;
	}

	/**
	 * Calculate frequency for a path
	 */
	calculate(path: string): SitemapEntry["changeFrequency"] {
		// Check each rule in order
		for (const rule of this.rules) {
			const pattern = rule.pattern;
			if (typeof pattern === "string") {
				if (path.includes(pattern)) {
					return rule.frequency;
				}
			} else if (pattern.test(path)) {
				return rule.frequency;
			}
		}

		// Return default if no rules match
		return this.defaultFrequency;
	}
}
