import { AUTHOR, PROJECT } from "@ux-patterns/constants/author";

export const FOOTER_GENERAL_LINKS = [
	{
		path: "/",
		label: "Home",
	},
	{
		path: "/patterns/getting-started",
		label: "Patterns",
	},
	{
		path: "/blog",
		label: "Blog",
	},
	{
		path: "/about",
		label: "About",
	},
];

export const FOOTER_RESOURCES_LINKS = [
	{
		path: "/llms.txt",
		label: "LLMs",
	},
	{
		path: "/glossary",
		label: "Glossary",
	},
	{
		path: "/privacy-policy",
		label: "Privacy Policy",
	},
];

export const FOOTER_OPENSOURCE_LINKS = [
	{
		path: "https://llmstxthub.com/",
		label: "LLMs.txt Hub",
		rel: "noopener noreferrer",
	},
	{
		path: "https://frontendchecklist.io/",
		label: "Front-End Checklist",
		rel: "noopener noreferrer",
	},
	{
		path: "https://github.com/thedaviddias/indie-dev-toolkit",
		label: "Indie Dev Toolkit",
		rel: "noopener noreferrer",
	},
];

export const SOCIAL_LINKS = [
	{
		label: "Instagram",
		link: AUTHOR.social.instagramUrl,
		rel: "noopener noreferrer",
		icon: "lucide:instagram",
	},
	{
		label: "GitHub",
		link: PROJECT.repository.url,
		rel: "noopener noreferrer",
		icon: "lucide:github",
	},
	{
		label: "Reddit",
		link: PROJECT.social.reddit,
		rel: "noopener noreferrer",
		icon: "lucide:reddit",
	},
];
