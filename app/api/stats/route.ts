import { unstable_cache } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

const PLAUSIBLE_API_URL = 'https://plausible.io/api/v2/query';
const SITE_ID = 'uxpatterns.dev';

// Cache the Plausible API call for 24 hours
const getPlausibleStats = unstable_cache(
  async (page: string) => {
    const apiKey = process.env.PLAUSIBLE_API_KEY;

    if (!apiKey) {
      console.error('PLAUSIBLE_API_KEY is not configured');
      return { pageviews: 0, visitors: 0 };
    }

    try {
      // Prepare both paths (current and legacy with /en/)
      const currentPath = page;
      const legacyPath = `/en${page}`;

      // Fetch stats for both paths
      const response = await fetch(PLAUSIBLE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          site_id: SITE_ID,
          metrics: ['pageviews', 'visitors'],
          date_range: 'all',
          dimensions: [],
          filters: [['is', 'event:page', [currentPath, legacyPath]]],
        }),
      });

      if (!response.ok) {
        throw new Error(`Plausible API error: ${response.status}`);
      }

      const data = await response.json();

      // Sum metrics from all results (handles multiple pages)
      let totalPageviews = 0;
      let totalVisitors = 0;

      // Handle different response structures
      if (data.results) {
        if (Array.isArray(data.results)) {
          data.results.forEach((result: any) => {
            // Metrics array: [pageviews, visitors]
            const [pageviews, visitors] = result.metrics || [0, 0];
            totalPageviews += pageviews || 0;
            totalVisitors += visitors || 0;
          });
        } else if (data.results.metrics) {
          // Single result object
          const [pageviews, visitors] = data.results.metrics || [0, 0];
          totalPageviews = pageviews || 0;
          totalVisitors = visitors || 0;
        }
      } else if (data.metrics) {
        // Metrics might be returned directly
        const [pageviews, visitors] = data.metrics || [0, 0];
        totalPageviews = pageviews || 0;
        totalVisitors = visitors || 0;
      }

      return {
        pageviews: totalPageviews,
        visitors: totalVisitors,
        period: 'all',
      };
    } catch (error) {
      console.error('Error fetching Plausible stats:', error);
      return { pageviews: 0, visitors: 0 };
    }
  },
  ['plausible-stats-v2'],
  {
    revalidate: 86400, // Cache for 24 hours (in seconds)
    tags: ['plausible'],
  }
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');

  if (!page) {
    return NextResponse.json({ error: 'Page parameter is required' }, { status: 400 });
  }

  const stats = await getPlausibleStats(page);

  return NextResponse.json(stats);
}
