import type { MetadataRoute } from "next";

/**
 * Robots.txt builder for Next.js apps
 */
export class RobotsBuilder {
	private rules: Array<{
		userAgent: string | string[];
		allow?: string | string[];
		disallow?: string | string[];
		crawlDelay?: number;
	}> = [];
	private sitemaps: string[] = [];
	private host?: string;

	/**
	 * Add a rule for specific user agents
	 */
	addRule(rule: {
		userAgent: string | string[];
		allow?: string | string[];
		disallow?: string | string[];
		crawlDelay?: number;
	}): this {
		this.rules.push(rule);
		return this;
	}

	/**
	 * Add a rule that allows everything for all user agents
	 */
	allowAll(except?: string[]): this {
		this.rules.push({
			userAgent: "*",
			allow: ["/"],
			disallow: except || [],
		});
		return this;
	}

	/**
	 * Add a rule that blocks everything for all user agents
	 */
	blockAll(except?: string[]): this {
		this.rules.push({
			userAgent: "*",
			disallow: ["/"],
			allow: except || [],
		});
		return this;
	}

	/**
	 * Add common disallow patterns
	 */
	addCommonDisallows(): this {
		const commonPaths = [
			"/404",
			"/500",
			"/api/*",
			"!/api/og/*", // Allow OG image generation
			"/_next/*",
			"/*.json$",
			"/*?*", // Block URL parameters
			"/admin",
			"/private",
		];

		const existingRule = this.rules.find(
			(r) =>
				r.userAgent === "*" ||
				(Array.isArray(r.userAgent) && r.userAgent.includes("*")),
		);

		if (existingRule) {
			const currentDisallow = Array.isArray(existingRule.disallow)
				? existingRule.disallow
				: existingRule.disallow
					? [existingRule.disallow]
					: [];

			existingRule.disallow = [
				...new Set([...currentDisallow, ...commonPaths]),
			];
		} else {
			this.rules.push({
				userAgent: "*",
				allow: ["/"],
				disallow: commonPaths,
			});
		}

		return this;
	}

	/**
	 * Add sitemap URL
	 */
	addSitemap(url: string): this {
		this.sitemaps.push(url);
		return this;
	}

	/**
	 * Set host
	 */
	setHost(host: string): this {
		this.host = host;
		return this;
	}

	/**
	 * Build robots.txt for Next.js
	 */
	build(): MetadataRoute.Robots {
		return {
			rules: this.rules,
			...(this.sitemaps.length > 0 && { sitemap: this.sitemaps }),
			...(this.host && { host: this.host }),
		};
	}

	/**
	 * Generate robots.txt content as string
	 */
	toString(): string {
		const lines: string[] = [];

		// Add rules
		for (const rule of this.rules) {
			const userAgents = Array.isArray(rule.userAgent)
				? rule.userAgent
				: [rule.userAgent];

			for (const agent of userAgents) {
				lines.push(`User-agent: ${agent}`);
			}

			if (rule.allow) {
				const allows = Array.isArray(rule.allow) ? rule.allow : [rule.allow];
				for (const path of allows) {
					lines.push(`Allow: ${path}`);
				}
			}

			if (rule.disallow) {
				const disallows = Array.isArray(rule.disallow)
					? rule.disallow
					: [rule.disallow];
				for (const path of disallows) {
					lines.push(`Disallow: ${path}`);
				}
			}

			if (rule.crawlDelay) {
				lines.push(`Crawl-delay: ${rule.crawlDelay}`);
			}

			lines.push(""); // Empty line between rules
		}

		// Add sitemaps
		for (const sitemap of this.sitemaps) {
			lines.push(`Sitemap: ${sitemap}`);
		}

		// Add host
		if (this.host) {
			lines.push(`Host: ${this.host}`);
		}

		return lines.join("\n");
	}
}

/**
 * Create a standard robots configuration
 */
export function createStandardRobots(
	baseUrl: string,
	options: {
		allowAll?: boolean;
		disallowPaths?: string[];
		allowPaths?: string[];
		blockBots?: string[];
		crawlDelay?: number;
		additionalSitemaps?: string[];
	} = {},
): MetadataRoute.Robots {
	const builder = new RobotsBuilder();

	// Handle blocked bots first
	if (options.blockBots && options.blockBots.length > 0) {
		for (const bot of options.blockBots) {
			builder.addRule({
				userAgent: bot,
				disallow: ["/"],
			});
		}
	}

	// Main rule for all other bots
	if (options.allowAll !== false) {
		const disallowPaths = [
			"/404",
			"/500",
			"/api/*",
			"!/api/og/*",
			...(options.disallowPaths || []),
		];

		builder.addRule({
			userAgent: "*",
			allow: options.allowPaths || ["/"],
			disallow: disallowPaths,
			crawlDelay: options.crawlDelay,
		});
	} else {
		builder.blockAll(options.allowPaths);
	}

	// Add sitemap
	builder.addSitemap(`${baseUrl}/sitemap.xml`);

	// Add additional sitemaps
	if (options.additionalSitemaps) {
		options.additionalSitemaps.forEach((sitemap) => {
			builder.addSitemap(
				sitemap.startsWith("http") ? sitemap : `${baseUrl}${sitemap}`,
			);
		});
	}

	return builder.build();
}

/**
 * Create SEO-friendly robots configuration
 */
export function createSEORobots(
	baseUrl: string,
	options: {
		disallowPaths?: string[];
		crawlDelay?: number;
		blockBadBots?: boolean;
	} = {},
): MetadataRoute.Robots {
	const builder = new RobotsBuilder();

	// Block known bad bots if requested
	if (options.blockBadBots) {
		const badBots = ["AhrefsBot", "SemrushBot", "DotBot", "MJ12bot", "BlexBot"];

		for (const bot of badBots) {
			builder.addRule({
				userAgent: bot,
				disallow: ["/"],
			});
		}
	}

	// Allow good bots with specific rules
	builder.addRule({
		userAgent: "Googlebot",
		allow: ["/"],
		disallow: [
			"/api/*",
			"!/api/og/*",
			"/private",
			...(options.disallowPaths || []),
		],
	});

	builder.addRule({
		userAgent: "Bingbot",
		allow: ["/"],
		disallow: [
			"/api/*",
			"!/api/og/*",
			"/private",
			...(options.disallowPaths || []),
		],
	});

	// General rule for all other bots
	builder.addRule({
		userAgent: "*",
		allow: ["/"],
		disallow: [
			"/404",
			"/500",
			"/api/*",
			"!/api/og/*",
			"/_next",
			"/private",
			...(options.disallowPaths || []),
		],
		crawlDelay: options.crawlDelay || 1,
	});

	// Add sitemap
	builder.addSitemap(`${baseUrl}/sitemap.xml`);

	return builder.build();
}

/**
 * Create development/staging robots configuration (blocks all bots)
 */
export function createDevRobots(): MetadataRoute.Robots {
	return new RobotsBuilder().blockAll().build();
}

/**
 * Helper to check if a path is allowed by robots rules
 */
export function isPathAllowed(
	path: string,
	rules: MetadataRoute.Robots["rules"],
	userAgent: string = "*",
): boolean {
	// Find applicable rules for the user agent
	const applicableRules = Array.isArray(rules)
		? rules.filter((rule) => {
				const agents = Array.isArray(rule.userAgent)
					? rule.userAgent
					: [rule.userAgent];
				return agents.includes(userAgent) || agents.includes("*");
			})
		: [rules].filter((rule) => {
				const agents = Array.isArray(rule.userAgent)
					? rule.userAgent
					: [rule.userAgent];
				return agents.includes(userAgent) || agents.includes("*");
			});

	// If no rules apply, allow by default
	if (applicableRules.length === 0) {
		return true;
	}

	// Check each rule
	for (const rule of applicableRules) {
		const allows = Array.isArray(rule.allow)
			? rule.allow
			: rule.allow
				? [rule.allow]
				: [];
		const disallows = Array.isArray(rule.disallow)
			? rule.disallow
			: rule.disallow
				? [rule.disallow]
				: [];

		// Check disallow patterns
		for (const pattern of disallows) {
			if (pattern.startsWith("!")) {
				// Negation - this path is explicitly allowed
				const negatedPattern = pattern.slice(1);
				if (matchesPattern(path, negatedPattern)) {
					return true;
				}
			} else if (matchesPattern(path, pattern)) {
				return false;
			}
		}

		// Check allow patterns
		for (const pattern of allows) {
			if (matchesPattern(path, pattern)) {
				return true;
			}
		}
	}

	// Default to disallow if no explicit allow
	return false;
}

/**
 * Helper to match path against pattern
 */
function matchesPattern(path: string, pattern: string): boolean {
	// Handle wildcards
	if (pattern.includes("*")) {
		const regexPattern = pattern
			.replace(/[.+?^${}()|[\]\\]/g, "\\$&") // Escape special chars except *
			.replace(/\*/g, ".*"); // Convert * to regex .*
		const regex = new RegExp(`^${regexPattern}`);
		return regex.test(path);
	}

	// Handle exact match or prefix match
	return path === pattern || path.startsWith(pattern);
}
