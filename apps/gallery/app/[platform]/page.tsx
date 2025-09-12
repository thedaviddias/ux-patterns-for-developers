import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { BrowseNavigation } from "@/components/common/browse-navigation";
import { GalleryClient } from "@/components/common/gallery-client";
import { Filters } from "@/components/filters/filters";
import { loadEntries } from "@/lib/loadEntries";
import { getAllPatternsFromWebApp } from "@/lib/pattern-utils";
import { searchEntries } from "@/lib/search";
import { PATTERN_CATEGORIES, parseUrlToFilters } from "@/lib/url-utils";

interface PageProps {
	params: Promise<{ platform: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { platform } = await params;

	return {
		title: `${platform === "web" ? "Web" : "Mobile"} UX Patterns - Gallery`,
		description: `Browse the best ${platform} UX patterns and design examples from real applications.`,
	};
}

export default async function PlatformPage({
	params,
	searchParams,
}: PageProps) {
	const { platform } = await params;
	const searchParamsResolved = await searchParams;

	if (!["web", "mobile"].includes(platform)) {
		notFound();
	}

	const filters = parseUrlToFilters(
		`/${platform}`,
		new URLSearchParams(searchParamsResolved as any),
	);
	const entries = await loadEntries();
	const patterns = await getAllPatternsFromWebApp();

	// Apply search and filters
	const filteredEntries = searchEntries(entries, filters.search || "", {
		platform,
		type:
			filters.quality === "all" || !filters.quality
				? undefined
				: filters.quality,
	});

	// Get categories that have content for this platform
	const categoriesWithContent = new Set<string>();
	entries.forEach((entry) => {
		if (entry.platform === platform) {
			const pattern = entry.pattern.toLowerCase().replace(/\s+/g, "-");
			for (const [category, patterns] of Object.entries(PATTERN_CATEGORIES)) {
				if (patterns.some((p) => p === pattern)) {
					categoriesWithContent.add(category);
				}
			}
		}
	});

	return (
		<div className="min-h-screen">
			{/* Browse Navigation - 4 Columns */}
			<BrowseNavigation
				currentQuality={filters.quality || "all"}
				currentPlatform={platform}
			/>

			<div className="bg-fd-card border-b border-fd-border">
				<div className="container-responsive py-8">
					<Breadcrumb
						items={[
							{ label: "Gallery", href: "/" },
							{
								label: platform === "web" ? "Web" : "Mobile",
								href: `/${platform}`,
							},
						]}
					/>
					<h1 className="text-3xl font-bold mb-2 mt-4">
						{platform === "web" ? "Web" : "Mobile"} Patterns
					</h1>
					<p className="text-fd-muted-foreground">
						Explore UX patterns and best practices for {platform} applications
					</p>
				</div>
			</div>

			<Suspense
				fallback={<div className="h-20 bg-fd-card border-b border-fd-border" />}
			>
				<Filters />
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
	return [{ platform: "web" }, { platform: "mobile" }];
}
