import {
	ChangeFrequencyCalculator,
	PriorityCalculator,
	SitemapBuilder,
} from "@ux-patterns/seo/sitemap";
import { getUniqueWebsites, loadEntries } from "@/lib/loadEntries";
import {
	getCategoryForPattern,
	PATTERN_CATEGORIES,
	patternToSlug,
} from "@/lib/url-utils";

export default async function sitemap() {
	const entries = await loadEntries();
	const baseUrl = "https://gallery.uxpatterns.dev";
	const builder = new SitemapBuilder(baseUrl);

	// Configure priority calculator
	const priorityCalc = new PriorityCalculator()
		.addRule("/", 1.0)
		.addRule(/^\/[^/]+$/, 0.9) // Platform pages
		.addRule(/^\/[^/]+\/[^/]+$/, 0.8) // Category pages
		.addRule(/^\/explore/, 0.8)
		.addRule(/^\/search/, 0.7)
		.addRule(/^\/[^/]+\/[^/]+\/[^/]+$/, 0.7) // Pattern pages
		.addRule(/^\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/, 0.6) // Quality pages
		.addRule(/^\/website\//, 0.5)
		.setDefault(0.5);

	// Configure change frequency calculator
	const frequencyCalc = new ChangeFrequencyCalculator()
		.addRule("/", "daily")
		.addRule(/^\/[^/]+$/, "daily")
		.addRule(/^\/explore/, "daily")
		.setDefault("weekly");

	// Track existing combinations from actual content
	const existingPaths = new Set<string>();
	const existingCategories = new Set<string>();
	const existingPatterns = new Set<string>();

	entries.forEach((entry) => {
		const pattern = patternToSlug(entry.pattern);
		const category = getCategoryForPattern(pattern);

		if (category) {
			// Track what actually exists
			existingCategories.add(`${entry.platform}/${category}`);
			existingPatterns.add(`${entry.platform}/${category}/${pattern}`);
			existingPaths.add(
				`${entry.platform}/${category}/${pattern}/${entry.type}`,
			);
		}
	});

	// Homepage
	builder.add({
		url: "",
		lastModified: new Date(),
		changeFrequency: "daily",
		priority: 1.0,
	});

	// Platform pages (always include both)
	for (const platform of ["web", "mobile"]) {
		builder.add({
			url: `/${platform}`,
			lastModified: new Date(),
			changeFrequency: frequencyCalc.calculate(`/${platform}`),
			priority: priorityCalc.calculate(`/${platform}`),
		});

		// Category pages (only if they have content)
		for (const category of Object.keys(PATTERN_CATEGORIES)) {
			if (existingCategories.has(`${platform}/${category}`)) {
				const categoryPath = `/${platform}/${category}`;
				builder.add({
					url: categoryPath,
					lastModified: new Date(),
					changeFrequency: frequencyCalc.calculate(categoryPath),
					priority: priorityCalc.calculate(categoryPath),
				});

				// Pattern pages within category
				const patterns =
					PATTERN_CATEGORIES[category as keyof typeof PATTERN_CATEGORIES];
				for (const pattern of patterns) {
					if (existingPatterns.has(`${platform}/${category}/${pattern}`)) {
						const patternPath = `/${platform}/${category}/${pattern}`;
						builder.add({
							url: patternPath,
							lastModified: new Date(),
							changeFrequency: frequencyCalc.calculate(patternPath),
							priority: priorityCalc.calculate(patternPath),
						});

						// Quality-specific pages
						for (const quality of ["do", "dont"]) {
							if (
								existingPaths.has(
									`${platform}/${category}/${pattern}/${quality}`,
								)
							) {
								const qualityPath = `/${platform}/${category}/${pattern}/${quality}`;
								builder.add({
									url: qualityPath,
									lastModified: new Date(),
									changeFrequency: frequencyCalc.calculate(qualityPath),
									priority: priorityCalc.calculate(qualityPath),
								});
							}
						}
					}
				}
			}
		}
	}

	// Other static pages
	builder.addMany([
		{
			url: "/search",
			lastModified: new Date(),
			changeFrequency: frequencyCalc.calculate("/search"),
			priority: priorityCalc.calculate("/search"),
		},
		{
			url: "/explore",
			lastModified: new Date(),
			changeFrequency: frequencyCalc.calculate("/explore"),
			priority: priorityCalc.calculate("/explore"),
		},
	]);

	// Website collections (based on actual content)
	const websites = getUniqueWebsites(entries);
	for (const website of websites) {
		if (website) {
			// Skip empty websites
			const websitePath = `/website/${website.toLowerCase().replace(/\s+/g, "-")}`;
			builder.add({
				url: websitePath,
				lastModified: new Date(),
				changeFrequency: frequencyCalc.calculate(websitePath),
				priority: priorityCalc.calculate(websitePath),
			});
		}
	}

	return builder.sort().build();
}
