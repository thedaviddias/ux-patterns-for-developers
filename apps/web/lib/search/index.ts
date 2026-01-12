/**
 * Orama Search Index
 *
 * Creates and manages the search index from Velite content.
 * Supports both client-side (title search) and server-side (full content) search.
 */

import { create, insert, search } from "@orama/orama";
import type { Orama } from "@orama/orama";
import { docs, blog } from "@/.velite";

/**
 * Orama schema definition
 */
const searchSchema = {
	id: "string",
	title: "string",
	description: "string",
	content: "string",
	url: "string",
	category: "string",
	type: "string",
	tags: "string[]",
} as const;

/**
 * Document type for our use
 */
export interface SearchDocumentType {
	id: string;
	title: string;
	description: string;
	content: string;
	url: string;
	category: string;
	type: "pattern" | "guide" | "glossary" | "blog" | "page";
	tags: string[];
}

/**
 * Search result type
 */
export interface SearchResult {
	id: string;
	title: string;
	description: string;
	url: string;
	category: string;
	type: SearchDocumentType["type"];
	score: number;
	highlight?: string;
}

// Cache the search index
let searchIndex: Orama<typeof searchSchema> | null = null;

/**
 * Extract plain text from MDX body for indexing
 * The body is compiled JSX, so we need to strip it down
 */
function extractTextFromMDX(body: string): string {
	// The body is compiled JSX code, we'll extract string literals
	// This is a simplified extraction - in production you might want to
	// actually render and extract text
	const stringLiterals = body.match(/"([^"\\]|\\.)*"/g) || [];
	const text = stringLiterals
		.map((s) => s.slice(1, -1)) // Remove quotes
		.filter((s) => s.length > 3) // Filter short strings
		.filter((s) => !s.startsWith("use ")) // Filter JSX directives
		.filter((s) => !s.includes("className")) // Filter class names
		.join(" ");

	return text.slice(0, 5000); // Limit content size
}

/**
 * Determine document type from slug
 */
function getDocumentType(slug: string): SearchDocumentType["type"] {
	if (slug.startsWith("patterns/")) return "pattern";
	if (slug.startsWith("pattern-guide/")) return "guide";
	if (slug.startsWith("glossary/")) return "glossary";
	if (slug.startsWith("blog/")) return "blog";
	return "page";
}

/**
 * Get category from slug
 */
function getCategory(slug: string): string {
	const parts = slug.split("/");
	if (parts.length >= 2) {
		return parts[1].replace(/-/g, " ");
	}
	return parts[0].replace(/-/g, " ");
}

/**
 * Create the search index from Velite content
 */
export async function createSearchIndex(): Promise<Orama<typeof searchSchema>> {
	const db = await create({
		schema: searchSchema,
	});

	// Index all docs
	for (const doc of docs) {
		// Skip drafts and coming-soon
		if (doc.status === "draft" || doc.status === "coming-soon") continue;

		await insert(db, {
			id: doc.slug,
			title: doc.title,
			description: doc.description || "",
			content: extractTextFromMDX(doc.body),
			url: doc.url,
			category: getCategory(doc.slug),
			type: getDocumentType(doc.slug),
			tags: doc.tags || [],
		});
	}

	// Index blog posts
	for (const post of blog) {
		await insert(db, {
			id: `blog/${post.slug}`,
			title: post.title,
			description: post.description || "",
			content: extractTextFromMDX(post.body),
			url: post.url,
			category: "blog",
			type: "blog",
			tags: post.tags || [],
		});
	}

	return db;
}

/**
 * Get the cached search index (creates it if not exists)
 */
export async function getSearchIndex(): Promise<Orama<typeof searchSchema>> {
	if (!searchIndex) {
		searchIndex = await createSearchIndex();
	}
	return searchIndex;
}

/**
 * Search the index
 */
export async function searchDocs(
	query: string,
	options?: {
		limit?: number;
		type?: SearchDocumentType["type"];
	}
): Promise<SearchResult[]> {
	const db = await getSearchIndex();

	const results = await search(db, {
		term: query,
		limit: options?.limit || 10,
		boost: {
			title: 3,
			description: 2,
			tags: 1.5,
			content: 1,
		},
		...(options?.type && {
			where: {
				type: options.type,
			},
		}),
	});

	return results.hits.map((hit) => ({
		id: hit.document.id,
		title: hit.document.title,
		description: hit.document.description,
		url: hit.document.url,
		category: hit.document.category,
		type: hit.document.type as SearchDocumentType["type"],
		score: hit.score,
	}));
}

/**
 * Quick search for titles only (client-side friendly)
 */
export function createQuickSearchData(): Array<{
	title: string;
	url: string;
	category: string;
	type: SearchDocumentType["type"];
}> {
	const results: Array<{
		title: string;
		url: string;
		category: string;
		type: SearchDocumentType["type"];
	}> = [];

	// Add docs
	for (const doc of docs) {
		if (doc.status === "draft" || doc.status === "coming-soon") continue;

		results.push({
			title: doc.title,
			url: doc.url,
			category: getCategory(doc.slug),
			type: getDocumentType(doc.slug),
		});
	}

	// Add blog posts
	for (const post of blog) {
		results.push({
			title: post.title,
			url: post.url,
			category: "blog",
			type: "blog",
		});
	}

	return results;
}
