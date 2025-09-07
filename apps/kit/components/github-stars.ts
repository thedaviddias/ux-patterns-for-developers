import { unstable_cache } from "next/cache";

interface GitHubRepoResponse {
	stargazers_count: number;
	full_name: string;
}

const fetchGitHubStars = async (): Promise<number> => {
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
		return data.stargazers_count;
	} catch (error) {
		console.error("Failed to fetch GitHub stars:", error);
		throw error;
	}
};

// Cache the GitHub stars fetch for 1 hour to avoid rate limits
export const getGitHubStars = unstable_cache(
	fetchGitHubStars,
	["github-stars"],
	{
		revalidate: 3600, // 1 hour
		tags: ["github-stars"],
	},
);
