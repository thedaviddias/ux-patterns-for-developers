import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { EmptyState } from "@/components/common/empty-state";
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
	params: Promise<{
		platform: string;
		category: string;
		pattern: string;
		quality: string;
	}>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { platform, pattern, quality } = await params;

	const patternName = slugToPattern(pattern);
	const platformName = platform === "web" ? "Web" : "Mobile";
	const qualityName = quality === "do" ? "Do" : "Don't";

	return {
		title: `${qualityName} ${patternName} Examples for ${platformName} - UX Gallery`,
		description: `Browse ${qualityName.toLowerCase()} examples of ${patternName.toLowerCase()} patterns for ${platformName.toLowerCase()} applications.`,
	};
}

export default async function PatternQualityPage({
	params,
	searchParams,
}: PageProps) {
	const { platform, category, pattern, quality } = await params;
	const searchParamsResolved = await searchParams;

	// Validate params
	if (!["web", "mobile"].includes(platform)) notFound();
	if (!isCategorySlug(category)) notFound();
	if (!["do", "dont"].includes(quality)) notFound();

	// Verify pattern belongs to category
	const patternCategory = getCategoryForPattern(pattern);
	if (patternCategory !== category) notFound();

	const filters = parseUrlToFilters(
		`/${platform}/${category}/${pattern}/${quality}`,
		new URLSearchParams(searchParamsResolved as any),
	);

	const entries = await loadEntries();

	// Filter entries for this specific pattern and quality
	const qualityEntries = entries.filter((entry) => {
		if (entry.platform !== platform) return false;
		if (entry.type !== quality) return false;

		const entryPattern = entry.pattern.toLowerCase().replace(/\s+/g, "-");
		return entryPattern === pattern;
	});

	// Apply additional filters (search, tags)
	const filteredEntries = searchEntries(
		qualityEntries,
		filters.search || "",
		{},
	);

	const patternName = slugToPattern(pattern);
	const categoryName = slugToPattern(category);
	const qualityName = quality === "do" ? "Do" : "Don't";

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
							{
								label: qualityName,
								href: `/${platform}/${category}/${pattern}/${quality}`,
							},
						]}
					/>
					<h1 className="text-3xl font-bold mb-2 mt-4">
						<span
							className={quality === "do" ? "text-green-600" : "text-red-600"}
						>
							{qualityName}
						</span>{" "}
						{patternName} Examples
					</h1>
					<p className="text-fd-muted-foreground">
						{quality === "do"
							? `Best practices and recommended implementations for ${patternName.toLowerCase()}`
							: `Common mistakes and patterns to avoid when implementing ${patternName.toLowerCase()}`}
					</p>
				</div>
			</div>

			<Suspense
				fallback={<div className="h-20 bg-fd-card border-b border-fd-border" />}
			>
				<Filters patterns={[]} variant="search" />
			</Suspense>

			<div className="container-responsive py-8">
				{filteredEntries.length === 0 ? (
					<EmptyState
						message={`No ${qualityName.toLowerCase()} examples found for ${patternName}.`}
						linkHref={`/${platform}/${category}/${pattern}`}
						linkText={`View all ${patternName} examples`}
					/>
				) : (
					<>
						<h2 className="text-lg font-semibold text-fd-foreground mb-6">
							{filteredEntries.length}{" "}
							{filteredEntries.length === 1 ? "example" : "examples"}
						</h2>
						<GalleryClient entries={filteredEntries} />
					</>
				)}
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
		quality: string;
	}> = [];

	entries.forEach((entry) => {
		const pattern = entry.pattern.toLowerCase().replace(/\s+/g, "-");
		const category = getCategoryForPattern(pattern);

		if (category) {
			const key = `${entry.platform}-${category}-${pattern}-${entry.type}`;
			if (!paramSet.has(key)) {
				paramSet.add(key);
				params.push({
					platform: entry.platform,
					category,
					pattern,
					quality: entry.type,
				});
			}
		}
	});

	return params;
}
