/**
 * Centralized author and project configuration
 * All author-related information should reference this file
 */

export const AUTHOR = {
	name: "David Dias",
	username: "thedaviddias",
	email: "hello@thedaviddias.com",
	website: "https://thedaviddias.com",
	social: {
		twitter: "@thedaviddias",
		twitterUrl: "https://x.com/thedaviddias",
		github: "thedaviddias",
		githubUrl: "https://github.com/thedaviddias",
		instagram: "uxpatternsfordevs",
		instagramUrl: "https://www.instagram.com/uxpatternsfordevs",
	},
} as const;

export const PROJECT = {
	name: "UX Patterns for Developers",
	shortName: "UX Patterns",
	repository: {
		owner: AUTHOR.username,
		name: "ux-patterns-for-developers",
		url: "https://github.com/thedaviddias/ux-patterns-for-developers",
	},
	discord: "https://discord.gg/8fsJFcCGbq",
	social: {
		reddit: "https://www.reddit.com/r/UXPatterns/",
	},
	urls: {
		main: "https://uxpatterns.dev",
		kit: "https://kit.uxpatterns.dev",
		gallery: "https://gallery.uxpatterns.dev",
	},
} as const;
