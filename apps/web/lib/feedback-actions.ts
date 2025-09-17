"use server";

import type { Octokit } from "octokit";
import { App } from "octokit";
import type { ActionResponse, Feedback } from "@/components/feedback";

/**
 * GitHub Discussions Feedback Integration
 *
 * This module handles feedback submission to GitHub Discussions.
 *
 * Setup required:
 * 1. Create a GitHub App with Discussions permissions
 * 2. Install the app on your repository
 * 3. Enable Discussions on your repository
 * 4. Create a "feedback" category in Discussions
 * 5. Set environment variables:
 *    - GITHUB_VOTE_APP_ID: Your GitHub App ID
 *    - GITHUB_VOTE_APP_PRIVATE_KEY: Your GitHub App private key
 */

const repo = "ux-patterns-for-developers";
const owner = "thedaviddias";
const DocsCategory = "feedback";

let instance: Octokit | undefined;

async function getOctokit(): Promise<Octokit> {
	if (instance) return instance;
	const appId = process.env.GITHUB_VOTE_APP_ID;
	const privateKey = process.env.GITHUB_VOTE_APP_PRIVATE_KEY;

	if (!appId || !privateKey) {
		throw new Error(
			"No GitHub keys provided for Github app, docs feedback feature will not work.",
		);
	}

	const parsedAppId = parseInt(appId, 10);
	if (Number.isNaN(parsedAppId)) {
		throw new Error(`Invalid GitHub App ID: "${appId}". Must be a number.`);
	}

	const app = new App({
		appId: parsedAppId,
		privateKey,
	});

	const { data } = await app.octokit.request(
		"GET /repos/{owner}/{repo}/installation",
		{
			owner,
			repo,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
		},
	);

	instance = await app.getInstallationOctokit(data.id);
	return instance;
}

interface RepositoryInfo {
	id: string;
	discussionCategories: {
		nodes: {
			id: string;
			name: string;
		}[];
	};
}

let cachedDestination: RepositoryInfo | undefined;
async function getFeedbackDestination() {
	if (cachedDestination) return cachedDestination;
	const octokit = await getOctokit();

	const {
		repository,
	}: {
		repository: RepositoryInfo;
	} = await octokit.graphql(`
  query {
    repository(owner: "${owner}", name: "${repo}") {
      id
      discussionCategories(first: 25) {
        nodes { id name }
      }
    }
  }
`);

	cachedDestination = repository;
	return cachedDestination;
}

export async function handleFeedbackRate(
	url: string,
	feedback: Feedback,
): Promise<ActionResponse> {
	try {
		const octokit = await getOctokit();
		const destination = await getFeedbackDestination();
		if (!octokit || !destination)
			throw new Error("GitHub comment integration is not configured.");

		const category = destination.discussionCategories.nodes.find(
			(category) => category.name === DocsCategory,
		);

		if (!category)
			throw new Error(
				`Please create a "${DocsCategory}" category in GitHub Discussion`,
			);

		const title = `Feedback for ${url}`;
		const body = `[${feedback.opinion}] ${feedback.message}\n\n> Forwarded from user feedback.`;

		let {
			search: {
				nodes: [discussion],
			},
		}: {
			search: {
				nodes: { id: string; url: string }[];
			};
		} = await octokit.graphql(`
          query {
            search(type: DISCUSSION, query: ${JSON.stringify(`${title} in:title repo:${owner}/${repo} author:@me`)}, first: 1) {
              nodes {
                ... on Discussion { id, url }
              }
            }
          }`);

		if (discussion) {
			await octokit.graphql(`
            mutation {
              addDiscussionComment(input: { body: ${JSON.stringify(body)}, discussionId: "${discussion.id}" }) {
                comment { id }
              }
            }`);
		} else {
			const result: {
				discussion: { id: string; url: string };
			} = await octokit.graphql(`
            mutation {
              createDiscussion(input: { repositoryId: "${destination.id}", categoryId: "${category.id}", body: ${JSON.stringify(body)}, title: ${JSON.stringify(title)} }) {
                discussion { id, url }
              }
            }`);

			discussion = result.discussion;
		}

		return {
			githubUrl: discussion.url,
		};
	} catch (error) {
		// Log the error for debugging
		console.error("GitHub App integration failed:", error);

		// Fallback: return a manual GitHub Discussion URL
		const title = `Feedback for ${url}`;
		const body = `[${feedback.opinion}] ${feedback.message}\n\n> Forwarded from user feedback.`;

		return {
			githubUrl: `https://github.com/${owner}/${repo}/discussions/new?category=feedback&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`,
		};
	}
}
