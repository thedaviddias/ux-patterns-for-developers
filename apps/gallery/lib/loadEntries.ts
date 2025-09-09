import { generateConsistentId } from "./id-generator";
import { entriesSource } from "./source";
import type { Entry } from "./types";

export async function loadEntries(): Promise<Entry[]> {
	// Get all pages from the entriesSource
	const pages = entriesSource.getPages();

	const entries: Entry[] = pages.map((page) => {
		const data = page.data;
		const _normalizedPattern = data.pattern.toLowerCase().replace(/\s+/g, "-");

		// Generate consistent ID based on website and image src
		const consistentId = generateConsistentId(data.website, data.media.src);

		return {
			id: consistentId, // Use generated consistent ID instead of frontmatter ID
			title: data.title || "",
			pattern: data.pattern,
			platform: data.platform,
			type: data.type,
			website: data.website,
			media: data.media,
			tags: data.tags || [],
			content: data.description || "", // Use description field for the content
			source: data.source,
			slug: page.slugs.join("/"), // Use slugs from page
			filePath: page.file.path,
			// Don't pass body function to client components
			// body: page.data.body,
		};
	});

	// Sort by captured date (newest first) or fallback to title
	return entries.sort((a, b) => {
		if (a.source?.capturedAt && b.source?.capturedAt) {
			return (
				new Date(b.source.capturedAt).getTime() -
				new Date(a.source.capturedAt).getTime()
			);
		}
		return a.title.localeCompare(b.title);
	});
}

export async function getEntryBySlug(
	pattern: string,
	slug: string,
): Promise<Entry | null> {
	const entries = await loadEntries();
	return (
		entries.find(
			(entry) =>
				entry.pattern.toLowerCase().replace(/\s+/g, "-") === pattern &&
				entry.slug === slug,
		) || null
	);
}

// Get entry with MDX body for server-side rendering
export function getEntryWithBody(id: string): (Entry & { body: any }) | null {
	const pages = entriesSource.getPages();

	// Find page by matching the generated consistent ID
	const page = pages.find((p) => {
		const consistentId = generateConsistentId(p.data.website, p.data.media.src);
		return consistentId === id;
	});

	if (!page) return null;

	const data = page.data;
	const consistentId = generateConsistentId(data.website, data.media.src);

	return {
		id: consistentId, // Use generated consistent ID
		title: data.title || "",
		pattern: data.pattern,
		platform: data.platform,
		type: data.type,
		website: data.website,
		media: data.media,
		tags: data.tags || [],
		content: data.description || "",
		source: data.source,
		slug: page.slugs.join("/"),
		filePath: page.file.path,
		body: page.data.body, // Include MDX body for server rendering
	};
}

export async function getEntriesByPattern(pattern: string): Promise<Entry[]> {
	const entries = await loadEntries();
	const normalizedPattern = pattern.replace(/-/g, " ").toLowerCase();

	return entries.filter(
		(entry) => entry.pattern.toLowerCase() === normalizedPattern,
	);
}

export function getUniquePatterns(entries: Entry[]): string[] {
	const patterns = new Set(entries.map((entry) => entry.pattern));
	return Array.from(patterns).sort();
}

export function getUniqueWebsites(entries: Entry[]): string[] {
	const websites = new Set(entries.map((entry) => entry.website));
	return Array.from(websites).sort();
}
