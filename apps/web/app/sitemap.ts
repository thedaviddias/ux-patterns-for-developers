import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
	ChangeFrequencyCalculator,
	PriorityCalculator,
	SitemapBuilder,
} from "@ux-patterns/seo/sitemap";
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

export default function sitemap() {
	const builder = new SitemapBuilder(BASE_URL);

	// Configure priority calculator
	const priorityCalc = new PriorityCalculator()
		.addRule("", 1.0) // Homepage
		.addRule("patterns/getting-started", 0.9)
		.addRule("patterns/", 0.8)
		.addRule("pattern-guide/", 0.7)
		.addRule("glossary/", 0.6)
		.addRule("blog/", 0.6)
		.setDefault(0.5);

	// Configure change frequency calculator
	const frequencyCalc = new ChangeFrequencyCalculator()
		.addRule("patterns/", "daily")
		.addRule("pattern-guide/", "weekly")
		.addRule("glossary/", "monthly")
		.addRule("blog/", "weekly")
		.setDefault("monthly");

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

	builder.addStaticPages(staticRoutes);

	// Add content routes
	const contentPages = pages.filter((page) => !staticRoutes.includes(page));
	builder.addDynamicPages(
		contentPages,
		(path) => priorityCalc.calculate(path),
		(path) => frequencyCalc.calculate(path),
	);

	return builder.sort().build();
}
