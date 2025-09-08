import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
// @ts-expect-error
import matter from "gray-matter";
import type { Entry } from "./types";

export async function loadEntries(): Promise<Entry[]> {
	const entries: Entry[] = [];
	const entriesDir = join(process.cwd(), "content/entries");

	try {
		// Get all pattern directories
		const patternDirs = await readdir(entriesDir);

		for (const patternDir of patternDirs) {
			const patternPath = join(entriesDir, patternDir);

			try {
				const files = await readdir(patternPath);
				const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

				for (const file of mdxFiles) {
					const filePath = join(patternPath, file);
					const content = await readFile(filePath, "utf-8");
					const { data: frontmatter } = matter(content);

					const fileName = file.replace(".mdx", "");

					const entry: Entry = {
						id: frontmatter.id || fileName,
						title: frontmatter.title || "",
						pattern: frontmatter.pattern || patternDir,
						platform: frontmatter.platform || "web",
						type: frontmatter.type || "do",
						website: frontmatter.website || "",
						media: frontmatter.media || { type: "image", src: "" },
						tags: frontmatter.tags || [],
						notes: frontmatter.notes || "",
						source: frontmatter.source,
						slug: fileName,
						filePath: `${patternDir}/${file}`,
					};

					entries.push(entry);
				}
			} catch (error) {
				console.warn(`Failed to read pattern directory: ${patternDir}`, error);
			}
		}
	} catch (error) {
		console.warn("Failed to read entries directory", error);
	}

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
