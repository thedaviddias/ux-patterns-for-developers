import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { type SearchDocumentType, searchDocs } from "@/lib/search";

// Force static generation with ISR
export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

// Cache search results for 1 hour
const getCachedSearchResults = unstable_cache(
	async (query: string, limit: number, type?: string) => {
		return searchDocs(query, {
			limit,
			type: type as SearchDocumentType["type"] | undefined,
		});
	},
	["search-results"],
	{
		revalidate: 3600, // Cache for 1 hour
		tags: ["search"],
	},
);

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q");
	const type = searchParams.get("type") as SearchDocumentType["type"] | null;
	const limit = searchParams.get("limit");

	if (!query || query.length < 2) {
		return NextResponse.json(
			{ results: [] },
			{
				headers: {
					"Cache-Control":
						"public, s-maxage=3600, stale-while-revalidate=86400",
				},
			},
		);
	}

	try {
		const results = await getCachedSearchResults(
			query,
			limit ? parseInt(limit, 10) : 10,
			type || undefined,
		);

		return NextResponse.json(
			{ results },
			{
				headers: {
					"Cache-Control":
						"public, s-maxage=3600, stale-while-revalidate=86400",
				},
			},
		);
	} catch (error) {
		console.error("Search error:", error);
		return NextResponse.json({ error: "Search failed" }, { status: 500 });
	}
}
