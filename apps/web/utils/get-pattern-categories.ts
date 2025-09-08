// import * as Sentry from "@sentry/nextjs";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

// Type-safe icon access
function getIconComponent(iconName: string): LucideIcon | undefined {
	return (Icons as unknown as Record<string, LucideIcon>)[iconName];
}

import { PATTERNS_MAP } from "@/constants/patterns";
import { source } from "@/lib/source";

import "server-only";

export type PatternStatus = "complete" | "draft" | "coming-soon";

export type PatternCategory = {
	name: string;
	path: string;
	description: string;
	patterns: Pattern[];
};

export type Pattern = {
	title: string;
	summary: string;
	description: string;
	href: string;
	icon?: LucideIcon;
	status: PatternStatus;
	frontMatter?: Record<string, unknown>;
};

export async function getPatternCategories(): Promise<PatternCategory[]> {
	// Get all pattern categories from Fumadocs
	const categories = Object.values(PATTERNS_MAP);

	// Get all pages from Fumadocs source
	const allPages = source.getPages();

	// Filter pages that are patterns (start with "patterns/")
	const patternPages = allPages.filter(
		(page) => page.slugs[0] === "patterns" && page.slugs.length > 1,
	);

	const categoryData = categories.map((category) => {
		try {
			// Filter pages for this specific category
			const categoryPages = patternPages.filter(
				(page) => page.slugs[1] === category.path,
			);

			return {
				name: category.name,
				path: category.path,
				description: category.description || "",
				patterns: categoryPages.map((page) => {
					const iconName = page.data.icon as string;
					const rawStatus = page.data.status as string;
					// Only apply pattern status validation to pattern files
					const status: PatternStatus =
						rawStatus === "complete" ||
						rawStatus === "draft" ||
						rawStatus === "coming-soon"
							? (rawStatus as PatternStatus)
							: "coming-soon";

					return {
						title: page.data.title || page.slugs[page.slugs.length - 1],
						summary:
							(page.data.summary as string) ||
							(page.data.description as string) ||
							"",
						description: (page.data.description as string) || "",
						href: page.url,
						icon: iconName ? getIconComponent(iconName) : undefined,
						status,
						frontMatter: page.data as unknown as Record<string, unknown>,
					};
				}),
			};
		} catch (error) {
			// If processing fails for this category, skip it
			console.warn(`Failed to process category ${category.path}:`, error);
			return null;
		}
	});

	return categoryData.filter((category) => category !== null);
}
