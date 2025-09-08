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

interface HomePageProps {
	searchParams: Promise<SearchParams>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
	const searchParamsResolved = await searchParams;
	const allEntries = await loadEntries();
	const patterns = getUniquePatterns(allEntries);

	// Apply filters - default to "all" platform on homepage
	const filteredEntries = searchEntries(
		allEntries,
		searchParamsResolved.search || "",
		{
			platform: searchParamsResolved.platform || "all", // Default to all on homepage
			type: searchParamsResolved.type,
			pattern: searchParamsResolved.pattern,
		},
	);

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<div className="bg-fd-card border-b border-fd-border">
				<div className="container-responsive py-12 text-center">
					<h1 className="text-4xl font-bold text-fd-foreground mb-4">
						UX Patterns Gallery
					</h1>
					<p className="text-xl text-fd-muted-foreground max-w-2xl mx-auto">
						Visual examples of UX patterns in the wild. Learn from real
						implementations—both good and bad.
					</p>
					<div className="mt-6 flex justify-center gap-8 text-sm text-fd-muted-foreground">
						<span>{allEntries.length} examples</span>
						<span>{patterns.length} patterns</span>
						<span>Educational use</span>
					</div>
				</div>
			</div>

			{/* Filters */}
			<Suspense
				fallback={<div className="h-20 bg-fd-card border-b border-fd-border" />}
			>
				<Filters patterns={patterns} variant="homepage" />
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
