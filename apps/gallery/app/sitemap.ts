import type { MetadataRoute } from "next";
import { getUniqueWebsites, loadEntries } from "@/lib/loadEntries";
import {
	getCategoryForPattern,
	PATTERN_CATEGORIES,
	patternToSlug,
} from "@/lib/url-utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const entries = await loadEntries();
	const baseUrl = "https://gallery.uxpatterns.dev";
	const urls: MetadataRoute.Sitemap = [];

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
	urls.push({
		url: baseUrl,
		lastModified: new Date(),
		changeFrequency: "daily",
		priority: 1.0,
	});

	// Platform pages (always include both)
	for (const platform of ["web", "mobile"]) {
		urls.push({
			url: `${baseUrl}/${platform}`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		});

		// Category pages (only if they have content)
		for (const category of Object.keys(PATTERN_CATEGORIES)) {
			if (existingCategories.has(`${platform}/${category}`)) {
				urls.push({
					url: `${baseUrl}/${platform}/${category}`,
					lastModified: new Date(),
					changeFrequency: "weekly",
					priority: 0.8,
				});

				// Pattern pages within category
				const patterns =
					PATTERN_CATEGORIES[category as keyof typeof PATTERN_CATEGORIES];
				for (const pattern of patterns) {
					if (existingPatterns.has(`${platform}/${category}/${pattern}`)) {
						urls.push({
							url: `${baseUrl}/${platform}/${category}/${pattern}`,
							lastModified: new Date(),
							changeFrequency: "weekly",
							priority: 0.7,
						});

						// Quality-specific pages
						for (const quality of ["do", "dont"]) {
							if (
								existingPaths.has(
									`${platform}/${category}/${pattern}/${quality}`,
								)
							) {
								urls.push({
									url: `${baseUrl}/${platform}/${category}/${pattern}/${quality}`,
									lastModified: new Date(),
									changeFrequency: "weekly",
									priority: 0.6,
								});
							}
						}
					}
				}
			}
		}
	}

	// Other static pages
	urls.push(
		{
			url: `${baseUrl}/search`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/explore`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},
	);

	// Website collections (based on actual content)
	const websites = getUniqueWebsites(entries);
	for (const website of websites) {
		if (website) {
			// Skip empty websites
			urls.push({
				url: `${baseUrl}/website/${website.toLowerCase().replace(/\s+/g, "-")}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.5,
			});
		}
	}

	return urls;
}
