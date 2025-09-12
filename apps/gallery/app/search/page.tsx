import { Suspense } from "react";
import { BrowseNavigation } from "@/components/common/browse-navigation";
import { EmptyState } from "@/components/common/empty-state";
import { GalleryClient } from "@/components/common/gallery-client";
import { Filters } from "@/components/filters/filters";
import { loadEntries } from "@/lib/loadEntries";
import { getAllPatternsFromWebApp } from "@/lib/pattern-utils";
import { searchEntries } from "@/lib/search";

interface SearchParams {
	platform?: string;
	quality?: string;
	pattern?: string;
	search?: string;
}

interface SearchPageProps {
	searchParams: Promise<SearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const searchParamsResolved = await searchParams;
	const allEntries = await loadEntries();
	const _patterns = await getAllPatternsFromWebApp();

	// Apply filters
	const filteredEntries = searchEntries(
		allEntries,
		Array.isArray(searchParamsResolved.search)
			? searchParamsResolved.search[0] || ""
			: searchParamsResolved.search || "",
		{
			platform: Array.isArray(searchParamsResolved.platform)
				? searchParamsResolved.platform[0] || undefined
				: searchParamsResolved.platform || undefined,
			type: Array.isArray(searchParamsResolved.quality)
				? searchParamsResolved.quality[0] || undefined
				: searchParamsResolved.quality || undefined,
			pattern: Array.isArray(searchParamsResolved.pattern)
				? searchParamsResolved.pattern[0] || null
				: searchParamsResolved.pattern || null,
		},
	);

	return (
		<div className="min-h-screen">
			{/* Browse Navigation - 4 Columns */}

			<BrowseNavigation
				currentQuality={searchParamsResolved.quality || "all"}
			/>

			{/* Filters */}
			<Suspense
				fallback={<div className="h-20 bg-fd-card border-b border-fd-border" />}
			>
				<Filters />
			</Suspense>

			{/* Results */}
			<div className="container-responsive py-8">
				{filteredEntries.length === 0 ? (
					<EmptyState
						message="No examples found matching your filters."
						subMessage="Try adjusting your search or filter criteria."
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
