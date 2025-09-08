import { Suspense } from "react";
import { GalleryClient } from "@/components/common/gallery-client";
import { Filters } from "@/components/filters/filters";
import { getUniquePatterns, loadEntries } from "@/lib/loadEntries";
import { searchEntries } from "@/lib/search";

interface ExplorePageProps {
	searchParams: Promise<{
		search?: string;
		platform?: string;
		type?: string;
		pattern?: string;
		id?: string;
	}>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
	const searchParamsResolved = await searchParams;
	const allEntries = await loadEntries();
	const patterns = getUniquePatterns(allEntries);

	// Apply filters - show all patterns by default
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
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-fd-foreground mb-2">
						Explore UX Patterns
					</h1>
					<p className="text-fd-muted-foreground">
						Discover design patterns and interactions from real applications
					</p>
				</div>

				<GalleryClient entries={filteredEntries} />
			</div>
		</div>
	);
}
