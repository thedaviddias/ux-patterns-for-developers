export async function getGitHubStars(): Promise<number> {
	try {
		// Use absolute URL for server-side rendering
		const baseUrl = process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: process.env.NODE_ENV === "development"
				? "http://localhost:3063"
				: "https://gallery.uxpatterns.dev";

		const response = await fetch(`${baseUrl}/api/github-stars`, {
			next: { revalidate: 3600 }, // Cache for 1 hour
		});

		if (!response.ok) {
			throw new Error(`API error: ${response.status}`);
		}

		const data = await response.json();
		return data.stars;
	} catch (error) {
		console.error("Failed to fetch GitHub stars:", error);
		return 0;
	}
}
