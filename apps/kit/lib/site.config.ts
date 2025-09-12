import { AUTHOR, PROJECT } from "@ux-patterns/constants/author";

export const siteConfig = {
	name: "UX Patterns Kit",
	description:
		"Ship better UX than most design teams. Production-ready React components with TypeScript, Tailwind CSS, and WCAG 2.2 compliance.",
	url: PROJECT.urls.kit,
	ogImage: "/og/opengraph-image.png",
	logo: "/logo.png",
	installCommand: "npx shadcn@latest add @upkit/button",

	// SEO metadata
	keywords: [
		"react components",
		"component library",
		"typescript components",
		"tailwind css components",
		"accessible components",
		"wcag compliant components",
		"react ui library",
		"production ready components",
		"copy paste components",
		"shadcn alternative",
		"ui kit",
		"react typescript library",
		"design system components",
		"up kit",
		"upkit components",
	],

	// Page-specific metadata
	pages: {
		home: {
			title: "Production-Ready React Components",
			description:
				"Ship better UX than most design teams. Production-ready React components with TypeScript, Tailwind CSS, and WCAG 2.2 compliance.",
		},
		changelog: {
			title: "Changelog",
			description:
				"Track new components, features, and improvements. See what's new in UP Kit's evolving component library.",
		},
		docs: {
			title: "Documentation",
			description:
				"Quick start guides and API references for UP Kit components. Copy, paste, and ship production-ready React UIs.",
		},
	},

	author: {
		name: AUTHOR.name,
		twitter: AUTHOR.social.twitter,
		url: AUTHOR.social.twitterUrl,
	},

	links: {
		github: PROJECT.repository.url,
		mainSite: PROJECT.urls.main,
	},

	// Advanced meta tags
	other: {
		"theme-color": "#09090b",
		"color-scheme": "dark light",
		"msapplication-TileColor": "#09090b",
	},
};
