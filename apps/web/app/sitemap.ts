import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";
import { BASE_URL } from "@/constants/project";

interface MetaConfig {
	title?: string;
	pages?: string[];
	icon?: string;
	root?: boolean;
	description?: string;
}

function getContentPages(dir: string, baseDir: string = ""): string[] {
	const pages: string[] = [];

	try {
		const items = readdirSync(dir);

		// Check if there's a meta.json file to respect Fumadocs structure
		const metaPath = join(dir, "meta.json");
		let metaConfig: MetaConfig | null = null;

		if (existsSync(metaPath)) {
			try {
				metaConfig = JSON.parse(readFileSync(metaPath, "utf-8"));
			} catch (error) {
				console.warn(`Error parsing meta.json in ${dir}:`, error);
			}
		}

		// If meta.json exists and has pages array, use it for ordering
		if (metaConfig?.pages) {
			for (const page of metaConfig.pages) {
				// Skip separators and special entries
				if (page.startsWith("---") || page === "..." || page.startsWith("[")) {
					continue;
				}

				const fullPath = join(dir, `${page}.mdx`);
				if (existsSync(fullPath)) {
					const pagePath = page === "index" ? baseDir : join(baseDir, page);
					pages.push(pagePath);
				}
			}

			// Handle "..." operator - include remaining pages not explicitly listed
			if (metaConfig.pages.includes("...")) {
				const explicitPages = metaConfig.pages
					.filter(
						(p) => !p.startsWith("---") && p !== "..." && !p.startsWith("["),
					)
					.map((p) => `${p}.mdx`);

				for (const item of items) {
					if (
						item.endsWith(".mdx") &&
						!item.startsWith("_") &&
						!explicitPages.includes(item)
					) {
						const pageName = item.replace(".mdx", "");
						const pagePath =
							pageName === "index" ? baseDir : join(baseDir, pageName);
						pages.push(pagePath);
					}
				}
			}
		} else {
			// Fallback to original behavior if no meta.json
			for (const item of items) {
				const fullPath = join(dir, item);
				const stat = statSync(fullPath);

				if (stat.isDirectory()) {
					// Skip hidden directories and _meta files
					if (!item.startsWith("_")) {
						pages.push(...getContentPages(fullPath, join(baseDir, item)));
					}
				} else if (item.endsWith(".mdx") && !item.startsWith("_")) {
					// Remove .mdx extension and index becomes empty string
					const pagePath =
						item === "index.mdx"
							? baseDir
							: join(baseDir, item.replace(".mdx", ""));
					pages.push(pagePath);
				}
			}
		}

		// Process subdirectories (for nested structures)
		for (const item of items) {
			const fullPath = join(dir, item);
			const stat = statSync(fullPath);

			if (stat.isDirectory() && !item.startsWith("_")) {
				// Process subdirectories that are listed in meta.json pages array
				if (metaConfig?.pages?.includes(item)) {
					pages.push(...getContentPages(fullPath, join(baseDir, item)));
				} else if (!metaConfig?.pages) {
					// If no meta.json, process all subdirectories
					pages.push(...getContentPages(fullPath, join(baseDir, item)));
				}
			}
		}
	} catch (error) {
		console.error(`Error reading directory ${dir}:`, error);
	}

	return pages;
}

export default function sitemap(): MetadataRoute.Sitemap {
	const routes: MetadataRoute.Sitemap = [];

	// Generate routes for content
	const contentDir = join(process.cwd(), "content");
	const pages = getContentPages(contentDir);

	// Add static routes first
	const staticRoutes = [
		"", // Homepage
		"about",
		"privacy-policy",
		"blog",
	];

	staticRoutes.forEach((route) => {
		routes.push({
			url: `${BASE_URL}${route ? `/${route}` : ""}`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: route === "" ? 1.0 : 0.7,
		});
	});

	// Add content routes
	pages.forEach((page) => {
		// Skip if already added as static route
		if (staticRoutes.includes(page)) return;

		routes.push({
			url: `${BASE_URL}/${page}`,
			lastModified: new Date(),
			changeFrequency: getChangeFrequency(page),
			priority: getPriority(page),
		});
	});

	return routes;
}

function getPriority(path: string): number {
	if (!path) return 1.0; // Homepage
	if (path === "patterns/getting-started") return 0.9;
	if (path.startsWith("patterns/")) return 0.8;
	if (path.startsWith("pattern-guide/")) return 0.7;
	if (path.startsWith("glossary/")) return 0.6;
	if (path.startsWith("blog/")) return 0.6;
	return 0.5; // Other pages
}

function getChangeFrequency(
	path: string,
): "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" {
	if (path.startsWith("patterns/")) return "daily";
	if (path.startsWith("pattern-guide/")) return "weekly";
	if (path.startsWith("glossary/")) return "monthly";
	if (path.startsWith("blog/")) return "weekly";
	return "monthly";
}
