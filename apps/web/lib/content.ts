/**
 * Content source module - Velite-based replacement for Fumadocs loader
 *
 * This module provides the same API surface as the Fumadocs source loader
 * but uses Velite-generated content instead.
 */

import { docs, blog, meta } from "../.velite";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { createElement, type ReactElement } from "react";

// Re-export types
export type Doc = (typeof docs)[number];
export type BlogPost = (typeof blog)[number];
export type Meta = (typeof meta)[number];

export type PatternStatus = "complete" | "draft" | "coming-soon" | "published";

/**
 * Table of Contents item type (from Velite's s.toc())
 * Structure is nested - depth is implicit via nesting level
 */
export interface TocItem {
	title: string;
	url: string;
	items: TocItem[];
}

export type TableOfContents = TocItem[];

/**
 * Content metadata type (from Velite's s.metadata())
 */
export interface ContentMetadata {
	readingTime: number;
	wordCount: number;
}

/**
 * Check if a doc is a draft (not published)
 */
export function isDraft(doc: Doc): boolean {
	return doc.status === "draft";
}

/**
 * Check if a doc should be visible (published or complete)
 */
export function isPublished(doc: Doc): boolean {
	return doc.status === "complete" || doc.status === "published";
}

/**
 * Page tree node types for navigation
 */
export type PageTreeNode =
	| PageTreeFolder
	| PageTreeItem
	| PageTreeSeparator;

export interface PageTreeFolder {
	type: "folder";
	name: string;
	icon?: ReactElement;
	index?: PageTreeItem;
	children: PageTreeNode[];
}

export interface PageTreeItem {
	type: "page";
	name: string;
	url: string;
	icon?: ReactElement;
	external?: boolean;
	draft?: boolean;
}

export interface PageTreeSeparator {
	type: "separator";
	name: string;
}

/**
 * Get icon component from name
 */
function getIcon(name: string | undefined): ReactElement | undefined {
	if (!name) return undefined;
	const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[name];
	return IconComponent
		? createElement(IconComponent, { className: "h-4 w-4" })
		: undefined;
}

/**
 * Get a single page by slug array
 */
export function getPage(slugs: string[]): Doc | undefined {
	const slug = slugs.join("/");
	return docs.find((doc) => doc.slug === slug);
}

/**
 * Get a blog post by slug
 */
export function getBlogPost(slug: string): BlogPost | undefined {
	return blog.find((post) => post.slug === slug);
}

/**
 * Get all docs with optional filtering
 */
export function getPages(options?: {
	filter?: (doc: Doc) => boolean;
}): Doc[] {
	if (options?.filter) {
		return docs.filter(options.filter);
	}
	return [...docs];
}

/**
 * Get all blog posts
 */
export function getBlogPosts(): BlogPost[] {
	return [...blog].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);
}

/**
 * Get patterns only (docs under patterns/)
 * @param includeDrafts - Whether to include draft patterns (default: false)
 */
export function getPatterns(includeDrafts = false): Doc[] {
	return docs.filter((doc) => {
		if (!doc.slug.startsWith("patterns/")) return false;
		if (!includeDrafts && isDraft(doc)) return false;
		return true;
	});
}

/**
 * Get patterns by category
 * @param category - The category slug (e.g., "forms", "navigation")
 * @param includeDrafts - Whether to include draft patterns (default: false)
 */
export function getPatternsByCategory(category: string, includeDrafts = false): Doc[] {
	return docs.filter((doc) => {
		if (!doc.slug.startsWith(`patterns/${category}/`)) return false;
		if (!includeDrafts && isDraft(doc)) return false;
		return true;
	});
}

/**
 * Get all draft patterns (for admin/preview purposes)
 */
export function getDraftPatterns(): Doc[] {
	return docs.filter((doc) => doc.slug.startsWith("patterns/") && isDraft(doc));
}

/**
 * Generate static params for all docs
 */
export function generateStaticParams(): { slug: string[] }[] {
	return docs.map((doc) => ({
		slug: doc.slugAsParams,
	}));
}

/**
 * Generate static params for blog posts
 */
export function generateBlogStaticParams(): { slug: string }[] {
	return blog.map((post) => ({
		slug: post.slug,
	}));
}

/**
 * Build page tree from meta.json files
 * This replicates the navigation structure from Fumadocs
 */
export function buildPageTree(): PageTreeNode[] {
	// Get root meta
	const rootMeta = meta.find((m) => m.path === "");
	if (!rootMeta) return [];

	return buildTreeFromMeta(rootMeta, "");
}

function buildTreeFromMeta(metaItem: Meta, basePath: string): PageTreeNode[] {
	const nodes: PageTreeNode[] = [];

	for (const pageName of metaItem.pages) {
		// Check if it's a separator
		if (pageName.startsWith("---") && pageName.endsWith("---")) {
			nodes.push({
				type: "separator",
				name: pageName.slice(3, -3),
			});
			continue;
		}

		const fullPath = basePath ? `${basePath}/${pageName}` : pageName;

		// Check if this is a folder (has its own meta.json)
		const folderMeta = meta.find((m) => m.path === fullPath);

		if (folderMeta) {
			// It's a folder
			const indexDoc = docs.find(
				(d) => d.slug === fullPath || d.slug === `${fullPath}/index`
			);

			const folder: PageTreeFolder = {
				type: "folder",
				name: folderMeta.title,
				icon: getIcon(folderMeta.icon),
				children: buildTreeFromMeta(folderMeta, fullPath),
			};

			if (indexDoc) {
				folder.index = {
					type: "page",
					name: indexDoc.title,
					url: indexDoc.url,
					icon: getIcon(indexDoc.icon),
					draft: isDraft(indexDoc),
				};
			}

			nodes.push(folder);
		} else {
			// It's a page
			const doc = docs.find(
				(d) => d.slug === fullPath || d.slug === `${basePath}/${pageName}`
			);

			if (doc) {
				nodes.push({
					type: "page",
					name: doc.title,
					url: doc.url,
					icon: getIcon(doc.icon),
					draft: isDraft(doc),
				});
			}
		}
	}

	return nodes;
}

/**
 * Cached page tree (built once)
 */
let cachedPageTree: PageTreeNode[] | null = null;

export function getPageTree(): PageTreeNode[] {
	if (!cachedPageTree) {
		cachedPageTree = buildPageTree();
	}
	return cachedPageTree;
}

/**
 * Get page tree for a specific section (patterns, pattern-guide, glossary)
 */
export function getSectionPageTree(section: string): PageTreeNode[] {
	const fullTree = getPageTree();

	// Find the folder matching the section
	const sectionFolder = fullTree.find(
		(node) => node.type === "folder" &&
		(node as PageTreeFolder).index?.url?.startsWith(`/${section}`) ||
		(node.type === "folder" && (node as PageTreeFolder).children.some(
			child => child.type === "page" && (child as PageTreeItem).url.startsWith(`/${section}`)
		))
	);

	if (sectionFolder && sectionFolder.type === "folder") {
		// Return just the children of this section
		return (sectionFolder as PageTreeFolder).children;
	}

	// Fallback: filter pages that start with this section
	return fullTree.filter((node) => {
		if (node.type === "page") {
			return (node as PageTreeItem).url.startsWith(`/${section}`);
		}
		if (node.type === "folder") {
			const folder = node as PageTreeFolder;
			return folder.index?.url?.startsWith(`/${section}`) ||
				folder.children.some(child =>
					child.type === "page" && (child as PageTreeItem).url.startsWith(`/${section}`)
				);
		}
		return false;
	});
}

/**
 * Get patterns page tree (just the patterns section)
 */
export function getPatternsPageTree(): PageTreeNode[] {
	return getSectionPageTree("patterns");
}

/**
 * Get pattern-guide page tree
 */
export function getPatternGuidePageTree(): PageTreeNode[] {
	return getSectionPageTree("pattern-guide");
}

/**
 * Get glossary page tree
 */
export function getGlossaryPageTree(): PageTreeNode[] {
	return getSectionPageTree("glossary");
}

/**
 * Content source object - provides similar API to Fumadocs loader
 */
export const content = {
	getPage,
	getPages,
	getBlogPost,
	getBlogPosts,
	getPatterns,
	getPatternsByCategory,
	generateStaticParams,
	generateBlogStaticParams,
	get pageTree() {
		return getPageTree();
	},
};

export default content;
