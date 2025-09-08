import type { Entry, SearchIndex } from "./types";

export function createSearchIndex(entries: Entry[]): SearchIndex[] {
	return entries.map((entry) => ({
		id: entry.id,
		title: entry.title,
		pattern: entry.pattern,
		platform: entry.platform,
		type: entry.type,
		website: entry.website,
		tags: entry.tags || [],
		notes: entry.notes,
		slug: entry.slug,
	}));
}

export function searchEntries(
	entries: Entry[],
	query: string,
	filters: {
		platform?: string;
		type?: string;
		pattern?: string | null;
	} = {},
): Entry[] {
	let filtered = entries;

	// Apply filters
	if (filters.platform && filters.platform !== "all") {
		filtered = filtered.filter((entry) => entry.platform === filters.platform);
	}

	if (filters.type && filters.type !== "all") {
		filtered = filtered.filter((entry) => entry.type === filters.type);
	}

	if (filters.pattern) {
		const normalizedPattern = filters.pattern.toLowerCase();
		filtered = filtered.filter((entry) => {
			// Check if pattern matches exactly
			if (entry.pattern.toLowerCase() === normalizedPattern) {
				return true;
			}
			// Check if any tag matches the pattern filter
			if (entry.tags?.some((tag) => tag.toLowerCase() === normalizedPattern)) {
				return true;
			}
			return false;
		});
	}

	// Apply search query
	if (query.trim()) {
		const searchTerm = query.toLowerCase().trim();
		filtered = filtered.filter((entry) => {
			const searchableContent = [
				entry.title,
				entry.pattern,
				entry.website,
				entry.notes,
				...(entry.tags || []),
			]
				.join(" ")
				.toLowerCase();

			return searchableContent.includes(searchTerm);
		});
	}

	return filtered;
}

// Simple fuzzy search implementation
export function fuzzySearch(entries: Entry[], query: string): Entry[] {
	if (!query.trim()) return entries;

	const searchTerm = query.toLowerCase().trim();
	const scored = entries.map((entry) => {
		// Removed unused variable

		let score = 0;

		// Exact matches in title get highest score
		if (entry.title.toLowerCase().includes(searchTerm)) {
			score += 10;
		}

		// Pattern matches get high score
		if (entry.pattern.toLowerCase().includes(searchTerm)) {
			score += 8;
		}

		// Website matches get medium score
		if (entry.website.toLowerCase().includes(searchTerm)) {
			score += 5;
		}

		// Notes and tags get lower score
		if (entry.notes.toLowerCase().includes(searchTerm)) {
			score += 3;
		}

		if (entry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))) {
			score += 2;
		}

		return { entry, score };
	});

	return scored
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.map((item) => item.entry);
}
