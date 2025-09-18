import fs from "fs";
import path from "path";

interface PatternDates {
	created: string | null;
	updated: string | null;
	isMajorUpdate: boolean;
	linesChanged: number;
	path: string;
}

let patternDatesCache: Record<string, PatternDates> | null = null;

/**
 * Load pattern dates from the pre-generated JSON file
 */
export function getPatternDates(): Record<string, PatternDates> {
	if (patternDatesCache) {
		return patternDatesCache;
	}

	try {
		const jsonPath = path.join(process.cwd(), ".next/pattern-dates.json");
		if (fs.existsSync(jsonPath)) {
			const data = fs.readFileSync(jsonPath, "utf-8");
			patternDatesCache = JSON.parse(data);
			return patternDatesCache;
		}
	} catch (error) {
		console.warn("Failed to load pattern dates:", error);
	}

	// Return empty object if file doesn't exist or fails to load
	patternDatesCache = {};
	return patternDatesCache;
}

/**
 * Get dates for a specific pattern
 */
export function getPatternDatesBySlug(slug: string): PatternDates | null {
	const allDates = getPatternDates();

	// Try different slug formats
	const possibleSlugs = [
		slug,
		slug.replace(/^\//, ""), // Remove leading slash
		slug.replace(/\/$/, ""), // Remove trailing slash
		slug.replace(/^patterns\//, ""), // Remove patterns prefix
	];

	for (const trySlug of possibleSlugs) {
		if (allDates[trySlug]) {
			return allDates[trySlug];
		}
	}

	return null;
}
