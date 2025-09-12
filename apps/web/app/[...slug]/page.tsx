import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metadataSEO } from "@/app/metadata";
import {
	generateArticleSchema,
	generateBlogPostingSchema,
	generateCollectionPageSchema,
	generateCourseSchema,
	generateHowToSchema,
	generateItemListSchema,
	generateWebSiteSchema,
	JsonLd,
	ORGANIZATION_SCHEMA,
} from "@/components/json-ld";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";
import { siteConfig } from "@/lib/site.config";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { generateBreadcrumbSchema } from "@/utils/generate-breadcrumb-schema";

export default async function Page(props: {
	params: Promise<{ slug: string[] }>;
}) {
	const params = await props.params;

	// Exclude blog posts from this catch-all route - they should be handled by blog/[slug]
	const isBlogPost = params.slug[0] === "blog" && params.slug.length > 1;
	if (isBlogPost) {
		notFound();
	}

	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;

	// Determine page type and properties
	const isHomepage = !params.slug || params.slug.length === 0;
	const isBlogListing = params.slug[0] === "blog" && params.slug.length === 1;
	const isPatternPage = params.slug[0] === "patterns" && params.slug.length > 2;
	const isPatternCategory =
		params.slug[0] === "patterns" && params.slug.length === 2;
	const isPatternsIndex =
		params.slug[0] === "patterns" && params.slug.length === 1;
	const isGlossaryPage =
		params.slug[0] === "glossary" && params.slug.length > 1;
	const isPatternGuide = params.slug[0] === "pattern-guide";

	const title = page.data.title || "UX Patterns for Devs";
	const description = page.data.description || "";
	const path = `/${params.slug?.join("/") || ""}`;

	// Generate appropriate schemas based on page type
	const schemas: Record<string, unknown>[] = [];

	if (isHomepage) {
		// Homepage gets WebSite and Organization schemas
		schemas.push(generateWebSiteSchema());
		schemas.push({ "@context": "https://schema.org", ...ORGANIZATION_SCHEMA });
	} else if (isBlogPost) {
		// Blog posts get BlogPosting schema
		const datePublished = page.data.date || page.data.datePublished;
		const dateModified =
			page.data.lastModified || page.data.dateModified || datePublished;
		const tags = page.data.tags || page.data.keywords || [];

		schemas.push(
			generateBlogPostingSchema(
				title,
				description,
				path,
				undefined, // image
				datePublished instanceof Date
					? datePublished.toISOString()
					: datePublished,
				dateModified instanceof Date
					? dateModified.toISOString()
					: dateModified,
				tags,
				page.data.wordCount,
			),
		);
	} else if (isBlogListing) {
		// Blog listing gets CollectionPage schema
		const allPages = source.getPages();
		const blogPages = allPages.filter(
			(p) => p.slugs[0] === "blog" && p.slugs.length > 1,
		);

		const items = blogPages.map((p) => ({
			name: p.data.title || "",
			url: p.url,
			datePublished:
				p.data.date instanceof Date
					? p.data.date.toISOString()
					: p.data.date ||
						(p.data.datePublished instanceof Date
							? p.data.datePublished.toISOString()
							: p.data.datePublished),
			description: p.data.description || "",
		}));

		schemas.push(generateCollectionPageSchema(title, description, path, items));
	} else if (isPatternPage) {
		// Pattern pages get both Article and HowTo schemas
		const category = params.slug[1];

		// Generate HowTo steps from metadata or default steps
		const steps = page.data.steps || [
			{
				name: "Understand the pattern",
				text: `Learn when and why to use the ${title} pattern in your application.`,
			},
			{
				name: "Review the anatomy",
				text: `Examine the key components and structure of the ${title} pattern.`,
			},
			{
				name: "Implement the pattern",
				text: `Follow the code examples to implement the ${title} pattern in your project.`,
			},
			{
				name: "Apply best practices",
				text: `Ensure accessibility, performance, and user experience best practices.`,
			},
		];

		schemas.push(
			generateHowToSchema(
				title,
				description,
				path,
				steps,
				page.data.totalTime || "PT30M",
				undefined, // image
			),
		);

		// Also add Article schema for patterns
		schemas.push(
			generateArticleSchema(
				title,
				description,
				path,
				undefined, // image
				page.data.datePublished instanceof Date
					? page.data.datePublished.toISOString()
					: page.data.datePublished,
				page.data.dateModified instanceof Date
					? page.data.dateModified.toISOString()
					: page.data.dateModified,
				category,
				page.data.wordCount,
			),
		);
	} else if (isPatternCategory || isPatternsIndex) {
		// Pattern category/listing pages get ItemList schema
		const allPages = source.getPages();
		const patternPages = allPages.filter(
			(p) => p.slugs[0] === "patterns" && p.slugs.length > 1,
		);

		const items = patternPages.map((p, index) => ({
			name: p.data.title || "",
			url: p.url,
			description: p.data.description || "",
			position: index + 1,
		}));

		schemas.push(generateItemListSchema(title, description, path, items));
	} else if (isPatternGuide) {
		// Pattern guide pages get Course schema
		schemas.push(
			generateCourseSchema(
				title,
				description,
				path,
				page.data.educationalLevel,
				page.data.timeRequired,
				page.data.prerequisites,
			),
		);
	} else if (isGlossaryPage) {
		// Glossary pages get DefinedTerm schema
		const jsonLdData = {
			"@context": "https://schema.org",
			"@type": "DefinedTerm",
			name: page.data.title,
			description: page.data.description,
			url: `${siteConfig.url}${page.url}`,
			inDefinedTermSet: {
				"@type": "DefinedTermSet",
				name: "UX Patterns Glossary",
				url: `${siteConfig.url}/glossary`,
			},
			...(page.data.category &&
				Array.isArray(page.data.category) &&
				page.data.category.length > 0 && {
					termCode: page.data.category.join(","),
				}),
		};
		schemas.push(jsonLdData);
	}

	// Add breadcrumb schema for non-homepage pages
	if (!isHomepage) {
		const breadcrumbItems = [{ name: "Home", url: "/" }];

		// Add intermediate breadcrumbs
		params.slug.forEach((segment, i) => {
			const url = `/${params.slug.slice(0, i + 1).join("/")}`;
			const name =
				segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
			breadcrumbItems.push({ name, url });
		});

		schemas.push(generateBreadcrumbSchema(breadcrumbItems));
	}

	return (
		<>
			{/* Render JSON-LD schemas */}
			{schemas.map((schema, index) => (
				<JsonLd
					key={`schema-${JSON.stringify(schema).slice(0, 50)}-${index}`}
					data={schema}
				/>
			))}

			<DocsPage
				tableOfContent={{
					style: "clerk",
					enabled: !isPatternGuide,
				}}
				toc={page.data.toc}
				full={page.data.full}
			>
				<DocsTitle>{page.data.title}</DocsTitle>
				<p className="text-lg text-fd-muted-foreground">
					{page.data.description}
				</p>
				<div className="flex flex-row gap-2 items-center border-b pt-2 pb-6">
					<LLMCopyButton markdownUrl={`${page.url}.mdx`} />
					<ViewOptions
						markdownUrl={`${page.url}.mdx`}
						githubUrl={`https://github.com/thedaviddias/ux-patterns-for-developers/blob/dev/apps/web/content/${page.path}`}
					/>
				</div>
				<DocsBody>
					<MDX components={getMDXComponents()} />
				</DocsBody>
			</DocsPage>
		</>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: {
	params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	// Determine page type and properties
	const isHomepage = !params.slug || params.slug.length === 0;
	const isBlogPost = params.slug[0] === "blog" && params.slug.length > 1;
	const isPatternPage = params.slug[0] === "patterns" && params.slug.length > 2;
	const isGlossaryPage =
		params.slug[0] === "glossary" && params.slug.length > 1;

	const title = page.data.title || "UX Patterns for Devs";
	const description = page.data.description || "";
	const path = `/${params.slug?.join("/") || ""}`;

	// Enhanced title with context
	const titleWithContext = isPatternPage
		? `${title} Pattern`
		: isGlossaryPage
			? `${title} - UX Glossary Term`
			: isBlogPost
				? `${title} - Blog Post`
				: title;

	// OG image handling
	const ogImageUrl = isHomepage
		? "/og/opengraph-image.png"
		: isPatternPage
			? `/og/patterns/${params.slug[params.slug.length - 1]}.png`
			: "/og/opengraph-image.png";

	// Base metadata
	const metadata: Metadata = {
		...metadataSEO,
		title: titleWithContext,
		description,
		alternates: {
			canonical: `${siteConfig.url}${path}`,
		},
		openGraph: {
			...metadataSEO.openGraph,
			title: titleWithContext,
			description,
			url: `${siteConfig.url}${path}`,
			images: [
				{
					url: ogImageUrl,
					width: 1200,
					height: 630,
					type: "image/png",
					alt: `${title} - UX Patterns for Developers`,
				},
			],
			...(isBlogPost && {
				type: "article",
				publishedTime: page.data.date || page.data.datePublished,
				modifiedTime: page.data.lastModified || page.data.dateModified,
				authors: ["David Dias"],
				tags: page.data.tags || page.data.keywords || [],
			}),
		},
		twitter: {
			...metadataSEO.twitter,
			title: titleWithContext,
			description,
			images: [
				{
					url: ogImageUrl,
					alt: `${title} - UX Patterns for Developers`,
				},
			],
		},
	};

	// Note: JSON-LD structured data is now handled in the page component
	// for better performance and cleaner separation of concerns

	return metadata;
}
