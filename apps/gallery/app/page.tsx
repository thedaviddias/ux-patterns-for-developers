import {
	JsonLd,
	StructuredDataGenerator,
} from "@ux-patterns/seo/structured-data";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Filters } from "@/components/filters/filters";
import EntriesGrid from "@/components/sections/entries-grid";
import Hero from "@/components/sections/hero";
import { loadEntries } from "@/lib/loadEntries";
import { getAllPatternsFromWebApp } from "@/lib/pattern-utils";
import { searchEntries } from "@/lib/search";
import { siteConfig } from "@/lib/site.config";

export const metadata: Metadata = {
	title: `${siteConfig.name} - ${siteConfig.pages.home.title}`,
	description: siteConfig.pages.home.description,
	keywords: siteConfig.keywords,
	alternates: {
		canonical: siteConfig.url,
	},
	openGraph: {
		title: siteConfig.name,
		description: siteConfig.pages.home.description,
		url: siteConfig.url,
	},
};

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
	const _patterns = await getAllPatternsFromWebApp();

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

	const structuredData = new StructuredDataGenerator({
		baseUrl: siteConfig.url,
		organizationName: siteConfig.name,
	});

	const schemas = [
		structuredData.website({
			name: siteConfig.name,
			description: siteConfig.description,
			url: siteConfig.url,
		}),
		structuredData.collectionPage({
			name: siteConfig.name,
			description: "Browse real-world UI pattern examples",
			url: siteConfig.url,
			hasPart: filteredEntries.slice(0, 10).map((entry) => ({
				name: entry.title,
				url: `${siteConfig.url}/${entry.platform}/${entry.pattern}/${entry.type}/${entry.id}`,
				description: `${entry.pattern} pattern from ${entry.website}`,
			})),
		}),
	];

	return (
		<>
			{schemas.map((schema, index) => (
				<JsonLd
					key={`${Array.isArray(schema["@type"]) ? schema["@type"].join("-") : schema["@type"]}-${index}`}
					data={schema}
				/>
			))}
			<div className="min-h-screen">
				{/* Hero Section */}
				<Hero />

				{/* Filters */}
				<Suspense
					fallback={
						<div className="h-20 bg-fd-card border-b border-fd-border" />
					}
				>
					<Filters />
				</Suspense>

				{/* Results */}
				<EntriesGrid filteredEntries={filteredEntries} />
			</div>
		</>
	);
}
