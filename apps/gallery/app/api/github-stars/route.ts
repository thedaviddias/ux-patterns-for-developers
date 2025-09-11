import { NextResponse } from "next/server";

interface GitHubRepoResponse {
	stargazers_count: number;
	full_name: string;
}

export async function GET() {
	// Only fetch GitHub stars if we have a token or are in development
	if (!process.env.GITHUB_TOKEN && process.env.NODE_ENV === "production") {
		return NextResponse.json({ stars: 0 });
	}

	try {
		const response = await fetch(
			"https://api.github.com/repos/thedaviddias/ux-patterns-for-developers",
			{
				headers: {
					Accept: "application/vnd.github.v3+json",
					"X-GitHub-Api-Version": "2022-11-28",
					"User-Agent": "UX-Patterns-for-Developers",
					...(process.env.GITHUB_TOKEN
						? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
						: {}),
				},
				signal: AbortSignal.timeout(5000),
			},
		);

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status}`);
		}

		const data: GitHubRepoResponse = await response.json();
		return NextResponse.json({ stars: data.stargazers_count });
	} catch (error) {
		console.error("Failed to fetch GitHub stars:", error);
		return NextResponse.json({ stars: 0 });
	}
}
