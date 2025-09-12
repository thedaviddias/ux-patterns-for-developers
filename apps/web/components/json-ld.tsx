import { AUTHOR, PROJECT } from "@ux-patterns/constants/author";
import {
	renderJsonLd,
	StructuredDataGenerator,
} from "@ux-patterns/seo/structured-data";
import { BASE_URL } from "@/constants/project";

interface JsonLdProps {
	data: Record<string, unknown> | Record<string, unknown>[];
}

// Helper for robust absolute URL handling
const absoluteUrl = (url?: string) =>
	!url ? undefined : new URL(url, BASE_URL).toString();

// Stable author ID for entity de-duplication
const AUTHOR_ID = `${BASE_URL}/about#author`;

// Create structured data generator instance
export const structuredDataGenerator = new StructuredDataGenerator({
	baseUrl: BASE_URL,
	organizationName: PROJECT.name,
	organizationLogo: "/img/ux-logo.png",
	authorName: AUTHOR.name,
	authorUrl: AUTHOR.website,
});

export function JsonLd({ data }: JsonLdProps) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={renderJsonLd(data)}
		/>
	);
}

// Organization schema reused across schemas
export const ORGANIZATION_SCHEMA = {
	"@type": "Organization",
	"@id": `${BASE_URL}/#organization`,
	name: PROJECT.name,
	url: BASE_URL,
	logo: {
		"@type": "ImageObject",
		url: `${BASE_URL}/img/ux-logo.png`,
		width: 512,
		height: 512,
	},
	sameAs: [PROJECT.repository.url, PROJECT.social.reddit],
	founder: {
		"@id": AUTHOR_ID,
		"@type": "Person",
		name: AUTHOR.name,
		url: AUTHOR.website,
	},
};

// WebSite schema for homepage
export function generateWebSiteSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${BASE_URL}/#website`,
		url: BASE_URL,
		name: PROJECT.name,
		description:
			"Comprehensive collection of UX patterns, best practices, and implementation guides for developers building accessible, effective, and user-friendly UI components.",
		publisher: {
			"@id": `${BASE_URL}/#organization`,
			"@type": "Organization",
			name: PROJECT.name,
			url: BASE_URL,
		},
		inLanguage: "en-US",
	};
}

// Enhanced Article schema with dates and sections
export function generateArticleSchema(
	title: string,
	description: string,
	path: string,
	image?: string,
	datePublished?: string,
	dateModified?: string,
	section?: string,
	wordCount?: number,
) {
	const imageUrl = absoluteUrl(image);

	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		description: description,
		url: `${BASE_URL}${path}`,
		...(imageUrl && {
			image: {
				"@type": "ImageObject",
				url: imageUrl,
			},
		}),
		...(datePublished && { datePublished }),
		...(dateModified && { dateModified }),
		...(section && { articleSection: section }),
		...(wordCount && { wordCount }),
		author: {
			"@id": AUTHOR_ID,
			"@type": "Person",
			name: AUTHOR.name,
			url: AUTHOR.website,
		},
		publisher: {
			"@id": `${BASE_URL}/#organization`,
			"@type": "Organization",
			name: PROJECT.name,
			url: BASE_URL,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${BASE_URL}${path}`,
		},
		inLanguage: "en-US",
	};
}

// BlogPosting schema for blog posts
export function generateBlogPostingSchema(
	title: string,
	description: string,
	path: string,
	image?: string,
	datePublished?: string,
	dateModified?: string,
	tags?: string[],
	wordCount?: number,
) {
	const imageUrl = absoluteUrl(image);

	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: title,
		description: description,
		url: `${BASE_URL}${path}`,
		...(imageUrl && {
			image: {
				"@type": "ImageObject",
				url: imageUrl,
			},
		}),
		...(datePublished && { datePublished }),
		...(dateModified && { dateModified }),
		...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
		...(wordCount && { wordCount }),
		author: {
			"@id": AUTHOR_ID,
			"@type": "Person",
			name: AUTHOR.name,
			url: AUTHOR.website,
		},
		publisher: {
			"@id": `${BASE_URL}/#organization`,
			"@type": "Organization",
			name: PROJECT.name,
			url: BASE_URL,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${BASE_URL}${path}`,
		},
		inLanguage: "en-US",
	};
}

// HowTo schema for pattern pages
export function generateHowToSchema(
	title: string,
	description: string,
	path: string,
	steps: Array<{
		name: string;
		text: string;
		url?: string;
		image?: string;
	}>,
	totalTime?: string,
	image?: string,
) {
	const imageUrl = absoluteUrl(image);

	return {
		"@context": "https://schema.org",
		"@type": "HowTo",
		name: title,
		description: description,
		url: `${BASE_URL}${path}`,
		inLanguage: "en-US",
		...(imageUrl && {
			image: {
				"@type": "ImageObject",
				url: imageUrl,
			},
		}),
		...(totalTime && { totalTime }),
		step: steps.map((step, index) => ({
			"@type": "HowToStep",
			position: index + 1,
			name: step.name,
			text: step.text,
			...(step.url && { url: step.url }),
			...(step.image && {
				image: {
					"@type": "ImageObject",
					url: absoluteUrl(step.image),
				},
			}),
		})),
		author: {
			"@id": AUTHOR_ID,
			"@type": "Person",
			name: AUTHOR.name,
			url: AUTHOR.website,
		},
		publisher: {
			"@id": `${BASE_URL}/#organization`,
			"@type": "Organization",
			name: PROJECT.name,
			url: BASE_URL,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${BASE_URL}${path}`,
		},
	};
}

// ItemList schema for category/listing pages
export function generateItemListSchema(
	title: string,
	description: string,
	path: string,
	items: Array<{
		name: string;
		url: string;
		description?: string;
		position?: number;
	}>,
) {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: title,
		description: description,
		url: `${BASE_URL}${path}`,
		numberOfItems: items.length,
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: Math.max(1, item.position ?? index + 1),
			item: {
				"@type": "Thing",
				name: item.name,
				url: absoluteUrl(item.url),
				...(item.description && { description: item.description }),
			},
		})),
	};
}

// CollectionPage schema for blog listing
export function generateCollectionPageSchema(
	title: string,
	description: string,
	path: string,
	items: Array<{
		name: string;
		url: string;
		datePublished?: string;
		description?: string;
	}>,
) {
	return {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: title,
		description: description,
		url: `${BASE_URL}${path}`,
		inLanguage: "en-US",
		hasPart: items.map((item) => ({
			"@type": "BlogPosting",
			headline: item.name,
			url: absoluteUrl(item.url),
			...(item.datePublished && { datePublished: item.datePublished }),
			...(item.description && { description: item.description }),
			author: {
				"@id": AUTHOR_ID,
				"@type": "Person",
				name: AUTHOR.name,
				url: AUTHOR.website,
			},
			publisher: {
				"@id": `${BASE_URL}/#organization`,
				"@type": "Organization",
				name: PROJECT.name,
				url: BASE_URL,
			},
		})),
		mainEntity: {
			"@type": "Blog",
			name: "UX Patterns for Devs Blog",
			description:
				"Articles and insights about UX patterns and developer experience",
			url: `${BASE_URL}/blog`,
			publisher: {
				"@id": `${BASE_URL}/#organization`,
				"@type": "Organization",
				name: PROJECT.name,
				url: BASE_URL,
			},
		},
	};
}

// SoftwareSourceCode schema for code examples
export function generateSoftwareSourceCodeSchema(
	name: string,
	description: string,
	programmingLanguage: string,
	codeText: string,
	codeRepository?: string,
) {
	return {
		"@context": "https://schema.org",
		"@type": "SoftwareSourceCode",
		name: name,
		description: description,
		programmingLanguage: {
			"@type": "ComputerLanguage",
			name: programmingLanguage,
		},
		text: codeText,
		...(codeRepository && { codeRepository }),
		author: {
			"@id": AUTHOR_ID,
			"@type": "Person",
			name: AUTHOR.name,
			url: AUTHOR.website,
		},
		publisher: {
			"@id": `${BASE_URL}/#organization`,
			"@type": "Organization",
			name: PROJECT.name,
			url: BASE_URL,
		},
	};
}

// Course/LearningResource schema for educational content
export function generateCourseSchema(
	title: string,
	description: string,
	path: string,
	educationalLevel?: string,
	timeRequired?: string,
	prerequisites?: string[],
) {
	return {
		"@context": "https://schema.org",
		"@type": "Course",
		name: title,
		description: description,
		url: `${BASE_URL}${path}`,
		provider: {
			"@id": `${BASE_URL}/#organization`,
			"@type": "Organization",
			name: PROJECT.name,
			url: BASE_URL,
		},
		author: {
			"@id": AUTHOR_ID,
			"@type": "Person",
			name: AUTHOR.name,
			url: AUTHOR.website,
		},
		isAccessibleForFree: true,
		...(educationalLevel && { educationalLevel }),
		...(timeRequired && { timeRequired }),
		...(prerequisites &&
			prerequisites.length > 0 && {
				coursePrerequisites: prerequisites.map((prereq) => ({
					"@type": "AlignmentObject",
					targetName: prereq,
				})),
			}),
		inLanguage: "en-US",
		learningResourceType: "Tutorial",
		teaches: {
			"@type": "DefinedTerm",
			name: "UX Patterns",
			description: "User experience patterns for web development",
		},
	};
}

// Person schema for author pages
export function generatePersonSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": AUTHOR_ID,
		name: AUTHOR.name,
		url: AUTHOR.website,
		image: {
			"@type": "ImageObject",
			url: `${AUTHOR.website}/_next/image?url=%2Fimages%2Fdavid-dias-round.jpg&w=256&q=75`,
		},
		jobTitle: "Frontend Developer & UX Enthusiast",
		description:
			"Creator of UX Patterns for Developers, helping developers build better user experiences.",
		sameAs: [
			PROJECT.social.reddit,
			AUTHOR.social.twitterUrl,
			AUTHOR.social.githubUrl,
			"https://linkedin.com/in/thedaviddias",
		],
		knowsAbout: [
			"User Experience Design",
			"Frontend Development",
			"React",
			"TypeScript",
			"Accessibility",
			"Web Performance",
		],
		worksFor: {
			"@type": "Organization",
			name: PROJECT.name,
			url: BASE_URL,
		},
	};
}

// Helper to combine multiple schemas
export function combineSchemas(
	...schemas: Array<Record<string, unknown> | null | undefined>
): Record<string, unknown>[] {
	return schemas.filter((s): s is Record<string, unknown> => Boolean(s));
}
