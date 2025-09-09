import { Suspense } from "react";
import { Filters } from "@/components/filters/filters";
import EntriesGrid from "@/components/sections/entries-grid";
import Hero from "@/components/sections/hero";
import { loadEntries } from "@/lib/loadEntries";
import { getAllPatternsFromWebApp } from "@/lib/pattern-utils";
import { searchEntries } from "@/lib/search";

interface SearchParams {
	platform?: string;
	quality?: string;
	pattern?: string;
	search?: string;
	[key: string]: string | string[] | undefined;
}

interface HomePageProps {
	searchParams: Promise<SearchParams>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
	const searchParamsResolved = await searchParams;
	const allEntries = await loadEntries();
	const patterns = await getAllPatternsFromWebApp();

	// Apply filters - default to "all" platform on homepage
	const filteredEntries = searchEntries(
		allEntries,
		Array.isArray(searchParamsResolved.search)
			? searchParamsResolved.search[0] || ""
			: searchParamsResolved.search || "",
		{
			platform: Array.isArray(searchParamsResolved.platform)
				? searchParamsResolved.platform[0] || "all"
				: searchParamsResolved.platform || "all", // Default to all on homepage
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
			{/* Hero Section */}
			<Hero />

			{/* Filters */}
			<Suspense
				fallback={<div className="h-20 bg-fd-card border-b border-fd-border" />}
			>
				<Filters patterns={patterns} variant="homepage" />
			</Suspense>

			{/* Results */}
			<EntriesGrid
				filteredEntries={filteredEntries}
				searchParamsResolved={searchParamsResolved}
			/>
		</div>
	);
}
