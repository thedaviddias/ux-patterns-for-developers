import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { getUniquePatterns, loadEntries } from "@/lib/loadEntries";

// Force static generation with ISR - this data rarely changes
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate every 24 hours

// Cache search data for 24 hours (content changes infrequently)
const getCachedSearchData = unstable_cache(
	async () => {
		const entries = await loadEntries();
		const patterns = getUniquePatterns(entries);
		return { entries, patterns };
	},
	["gallery-search-data"],
	{
		revalidate: 86400, // Cache for 24 hours
		tags: ["gallery", "search-data"],
	},
);

export async function GET() {
	try {
		const data = await getCachedSearchData();

		return NextResponse.json(data, {
			headers: {
				"Cache-Control":
					"public, s-maxage=86400, stale-while-revalidate=604800",
			},
		});
	} catch (error) {
		console.error("Failed to load search data:", error);
		return NextResponse.json(
			{ error: "Failed to load search data" },
			{ status: 500 },
		);
	}
}
