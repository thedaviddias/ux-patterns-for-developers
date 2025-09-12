import { AUTHOR, PROJECT } from "@ux-patterns/constants/author";

export const siteConfig = {
	name: PROJECT.name,
	shortName: PROJECT.shortName,
	description:
		"Master UX patterns with clear guides. Learn when to use modals vs forms, implement accessible designs, and make better UI decisions.",
	url: PROJECT.urls.main,
	ogImage: "/og/opengraph-image.png",
	logo: "/logo.png",

	// SEO metadata
	keywords: [
		"ux patterns documentation",
		"ui design patterns",
		"pattern guides",
		"ux best practices",
		"design documentation",
		"accessibility guidelines",
		"wcag compliance",
		"user experience patterns",
		"interface design guides",
		"pattern implementation",
		"ux glossary",
		"design decisions",
		"pattern library documentation",
		"when to use patterns",
	],

	// Page-specific metadata
	pages: {
		home: {
			title: "Documentation & Guides",
			description:
				"Master UX patterns with clear guides. Learn when to use modals vs forms, implement accessible designs, and make better UI decisions.",
		},
		blog: {
			title: "Blog",
			description:
				"Expert insights on UX patterns, accessibility, and implementation. Real-world examples to help you build better user interfaces.",
			keywords: [
				"ux blog",
				"design patterns articles",
				"accessibility guides",
				"ux best practices blog",
				"interface design articles",
				"pattern implementation guides",
				"web accessibility blog",
				"developer ux tips",
			],
		},
		about: {
			title: "About",
			description:
				"Bridging design and development. Our mission to help developers create exceptional user experiences through proven UX patterns.",
		},
	},

	author: {
		name: AUTHOR.name,
		twitter: AUTHOR.social.twitter,
		url: AUTHOR.social.twitterUrl,
	},

	links: {
		github: PROJECT.repository.url,
		twitter: AUTHOR.social.twitterUrl,
	},
};
