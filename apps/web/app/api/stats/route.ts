import { unstable_cache } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

const OPENPANEL_API_URL = "https://api.openpanel.dev";

// Cache the OpenPanel API call for 24 hours
const getPageStats = unstable_cache(
	async (page: string) => {
		const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;
		const clientSecret = process.env.OPENPANEL_CLIENT_SECRET;

		if (!clientId || !clientSecret) {
			console.error("OpenPanel credentials are not configured");
			return { pageviews: 0, visitors: 0 };
		}

		try {
			const filters = JSON.stringify([
				{ name: "path", operator: "is", value: [page] },
			]);

			const response = await fetch(
				`${OPENPANEL_API_URL}/insights/${clientId}/metrics?range=90d&filters=${encodeURIComponent(filters)}`,
				{
					headers: {
						"openpanel-client-id": clientId,
						"openpanel-client-secret": clientSecret,
					},
				},
			);

			if (!response.ok) {
				throw new Error(`OpenPanel API error: ${response.status}`);
			}

			const data = await response.json();

			return {
				pageviews: data.metrics?.total_screen_views ?? 0,
				visitors: data.metrics?.unique_visitors ?? 0,
				period: "90d",
			};
		} catch (error) {
			console.error("Error fetching OpenPanel stats:", error);
			return { pageviews: 0, visitors: 0 };
		}
	},
	["openpanel-stats-v1"],
	{
		revalidate: 86400,
		tags: ["analytics"],
	},
);

// Dynamic route - reads query parameters at runtime
// Caching is handled by unstable_cache and Cache-Control header
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const page = searchParams.get("page");

	if (!page) {
		return NextResponse.json(
			{ error: "Page parameter is required" },
			{ status: 400 },
		);
	}

	const stats = await getPageStats(page);

	return NextResponse.json(stats, {
		headers: {
			"Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
		},
	});
}
