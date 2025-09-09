import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { GalleryClient } from "@/components/common/gallery-client";
import { Filters } from "@/components/filters/filters";
import { loadEntries } from "@/lib/loadEntries";
import { searchEntries } from "@/lib/search";
import {
	getCategoryForPattern,
	isCategorySlug,
	parseUrlToFilters,
	slugToPattern,
} from "@/lib/url-utils";

interface PageProps {
	params: Promise<{ platform: string; category: string; pattern: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { platform, pattern } = await params;

	const patternName = slugToPattern(pattern);
	const platformName = platform === "web" ? "Web" : "Mobile";

	return {
		title: `${patternName} Pattern for ${platformName} - UX Gallery`,
		description: `Examples and best practices for ${patternName.toLowerCase()} in ${platformName.toLowerCase()} applications.`,
	};
}

export default async function PatternPage({ params, searchParams }: PageProps) {
	const { platform, category, pattern } = await params;
	const searchParamsResolved = await searchParams;

	if (!["web", "mobile"].includes(platform)) notFound();
	if (!isCategorySlug(category)) notFound();

	// Verify pattern belongs to category
	const patternCategory = getCategoryForPattern(pattern);
	if (patternCategory !== category) notFound();

	const filters = parseUrlToFilters(
		`/${platform}/${category}/${pattern}`,
		new URLSearchParams(searchParamsResolved as any),
	);

	const entries = await loadEntries();

	// Filter entries for this specific pattern
	const patternEntries = entries.filter((entry) => {
		if (entry.platform !== platform) return false;

		const entryPattern = entry.pattern.toLowerCase().replace(/\s+/g, "-");
		return entryPattern === pattern;
	});

	// Apply additional filters
	const filteredEntries = searchEntries(patternEntries, filters.search || "", {
		type:
			filters.quality === "all" || !filters.quality
				? undefined
				: filters.quality,
	});

	const patternName = slugToPattern(pattern);
	const categoryName = slugToPattern(category);

	// Count do's and don'ts
	const _doCount = patternEntries.filter((e) => e.type === "do").length;
	const _dontCount = patternEntries.filter((e) => e.type === "dont").length;

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
							{
								label: patternName,
								href: `/${platform}/${category}/${pattern}`,
							},
						]}
					/>
					<h1 className="text-3xl font-bold mb-2 mt-4">
						{patternName} Pattern
					</h1>
					<p className="text-fd-muted-foreground">
						Examples and best practices for {patternName.toLowerCase()} in{" "}
						{platform} applications
					</p>
				</div>
			</div>

			<Suspense
				fallback={<div className="h-20 bg-fd-card border-b border-fd-border" />}
			>
				<Filters patterns={[]} variant="search" />
			</Suspense>

			<div className="container-responsive py-8">
				<h2 className="text-lg font-semibold text-fd-foreground mb-6">
					{filteredEntries.length}{" "}
					{filteredEntries.length === 1 ? "example" : "examples"}
				</h2>
				<GalleryClient entries={filteredEntries} />
			</div>
		</div>
	);
}

export async function generateStaticParams() {
	const entries = await loadEntries();
	const paramSet = new Set<string>();
	const params: Array<{
		platform: string;
		category: string;
		pattern: string;
	}> = [];

	entries.forEach((entry) => {
		const pattern = entry.pattern.toLowerCase().replace(/\s+/g, "-");
		const category = getCategoryForPattern(pattern);

		if (category) {
			const key = `${entry.platform}-${category}-${pattern}`;
			if (!paramSet.has(key)) {
				paramSet.add(key);
				params.push({
					platform: entry.platform,
					category,
					pattern,
				});
			}
		}
	});

	return params;
}
