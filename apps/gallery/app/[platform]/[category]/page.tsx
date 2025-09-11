import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { GalleryClient } from "@/components/common/gallery-client";
import { Filters } from "@/components/filters/filters";
import { loadEntries } from "@/lib/loadEntries";
import { searchEntries } from "@/lib/search";
import {
	isCategorySlug,
	PATTERN_CATEGORIES,
	parseUrlToFilters,
	slugToPattern,
} from "@/lib/url-utils";

interface PageProps {
	params: Promise<{ platform: string; category: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { platform, category } = await params;

	const categoryName = slugToPattern(category);
	const platformName = platform === "web" ? "Web" : "Mobile";

	return {
		title: `${categoryName} Patterns for ${platformName} - UX Gallery`,
		description: `Browse ${categoryName.toLowerCase()} patterns and examples for ${platformName.toLowerCase()} applications.`,
	};
}

export default async function CategoryPage({
	params,
	searchParams,
}: PageProps) {
	const { platform, category } = await params;
	const searchParamsResolved = await searchParams;

	if (!["web", "mobile"].includes(platform)) notFound();
	if (!isCategorySlug(category)) notFound();

	const filters = parseUrlToFilters(
		`/${platform}/${category}`,
		new URLSearchParams(searchParamsResolved as any),
	);

	const entries = await loadEntries();
	const categoryPatterns = [
		...(PATTERN_CATEGORIES[category as keyof typeof PATTERN_CATEGORIES] || []),
	];

	// Filter entries by category patterns
	const categoryEntries = entries.filter((entry) => {
		if (entry.platform !== platform) return false;

		const entryPattern = entry.pattern.toLowerCase().replace(/\s+/g, "-");
		return categoryPatterns.some((p) => p === entryPattern);
	});

	// Apply additional filters and search
	const filteredEntries = searchEntries(categoryEntries, filters.search || "", {
		type:
			filters.quality === "all" || !filters.quality
				? undefined
				: filters.quality,
	});

	const categoryName = slugToPattern(category);

	// Get unique patterns that actually have content
	const patternsWithContent = new Set<string>();
	categoryEntries.forEach((entry) => {
		const pattern = entry.pattern.toLowerCase().replace(/\s+/g, "-");
		if (categoryPatterns.includes(pattern as any)) {
			patternsWithContent.add(pattern);
		}
	});

	return (
		<div className="min-h-screen">
			<div className="bg-fd-card border-b border-fd-border">
				<div className="container-responsive py-8">
					<Breadcrumb
						items={[
							{ label: "Gallery", href: "/" },
							{
								label: platform === "web" ? "Web" : "Mobile",
								href: `/${platform}`,
							},
							{ label: categoryName, href: `/${platform}/${category}` },
						]}
					/>
					<h1 className="text-3xl font-bold mb-2 mt-4">
						{categoryName} Patterns
					</h1>
					<p className="text-fd-muted-foreground">
						{categoryName} components and patterns for {platform} applications
					</p>
				</div>
			</div>

			<Suspense
				fallback={<div className="h-20 bg-fd-card border-b border-fd-border" />}
			>
				<Filters patterns={[]} variant="search" />
			</Suspense>

			<div className="container-responsive py-8">
				{/* Pattern Grid */}

				{/* All Category Entries */}
				<div className="mb-6">
					<h2 className="text-xl font-semibold mb-4">
						All {categoryName} Examples
					</h2>
				</div>
				<Suspense
					fallback={
						<div className="text-fd-muted-foreground">Loading gallery...</div>
					}
				>
					<GalleryClient entries={filteredEntries} />
				</Suspense>
			</div>
		</div>
	);
}

export async function generateStaticParams() {
	const params: Array<{
		platform: string;
		category: string;
	}> = [];

	for (const platform of ["web", "mobile"]) {
		for (const category of Object.keys(PATTERN_CATEGORIES)) {
			params.push({ platform, category });
		}
	}

	return params;
}
