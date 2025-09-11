import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { generateEntryId } from "./id-generator";
import type { Entry } from "./types";

export async function loadEntries(): Promise<Entry[]> {
	const entries: Entry[] = [];
	const entriesDir = join(process.cwd(), "content/entries");
	const idMappingPath = join(process.cwd(), "data/id-mapping.json");

	// Load existing ID mapping
	let idMapping: Record<string, string> = {};
	try {
		if (existsSync(idMappingPath)) {
			const mappingContent = await readFile(idMappingPath, "utf-8");
			idMapping = JSON.parse(mappingContent);
		}
	} catch (error) {
		console.warn("Failed to load ID mapping, using new IDs", error);
	}

	let mappingUpdated = false;

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
					const { data: frontmatter, content: mdxContent } = matter(content);

					const fileName = file.replace(".mdx", "");
					const mappingKey = `${patternDir}/${fileName}`;

					// Use existing ID from mapping, frontmatter, or generate new
					let entryId: string;
					if (idMapping[mappingKey]) {
						// Use existing mapped ID
						entryId = idMapping[mappingKey];
					} else if (frontmatter.id && frontmatter.id.length === 8) {
						// Use frontmatter ID if valid short ID
						entryId = frontmatter.id;
						idMapping[mappingKey] = entryId;
						mappingUpdated = true;
					} else {
						// Generate new ID and save to mapping
						entryId = generateEntryId();
						idMapping[mappingKey] = entryId;
						mappingUpdated = true;
					}

					const entry: Entry = {
						id: entryId,
						title: frontmatter.title || "",
						pattern: frontmatter.pattern || patternDir,
						platform: frontmatter.platform || "web",
						type: frontmatter.type || "do",
						website: frontmatter.website || "",
						media: frontmatter.media || { type: "image", src: "" },
						tags: frontmatter.tags || [],
						content: mdxContent.trim(),
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

	// Save updated mapping if changed
	if (mappingUpdated) {
		try {
			await writeFile(idMappingPath, JSON.stringify(idMapping, null, 2));
		} catch (error) {
			console.warn("Failed to save ID mapping", error);
		}
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
