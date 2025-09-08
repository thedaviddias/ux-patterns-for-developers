import { Suspense } from "react";
import { GalleryClient } from "@/components/common/gallery-client";
import { Filters } from "@/components/filters/filters";
import { getUniquePatterns, loadEntries } from "@/lib/loadEntries";
import { searchEntries } from "@/lib/search";

interface SearchParams {
	platform?: string;
	type?: string;
	pattern?: string;
	search?: string;
}

interface SearchPageProps {
	searchParams: Promise<SearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const searchParamsResolved = await searchParams;
	const allEntries = await loadEntries();
	const patterns = getUniquePatterns(allEntries);

	// Apply filters
	const filteredEntries = searchEntries(
		allEntries,
		searchParamsResolved.search || "",
		{
			platform: searchParamsResolved.platform,
			type: searchParamsResolved.type,
			pattern: searchParamsResolved.pattern,
		},
	);

	return (
		<div className="min-h-screen">
			{/* Filters */}
			<Suspense
				fallback={<div className="h-20 bg-fd-card border-b border-fd-border" />}
			>
				<Filters patterns={patterns} variant="search" />
			</Suspense>

			{/* Results */}
			<div className="container-responsive py-8">
				{filteredEntries.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-fd-muted-foreground text-lg">
							No examples found matching your filters.
						</p>
						<p className="text-fd-muted-foreground/60 text-sm mt-2">
							Try adjusting your search or filter criteria.
						</p>
					</div>
				) : (
					<>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-semibold text-fd-foreground">
								{filteredEntries.length}{" "}
								{filteredEntries.length === 1 ? "example" : "examples"}
								{searchParamsResolved.pattern &&
									` for ${searchParamsResolved.pattern}`}
							</h2>
						</div>

						<GalleryClient entries={filteredEntries} />
					</>
				)}
			</div>
		</div>
	);
}
