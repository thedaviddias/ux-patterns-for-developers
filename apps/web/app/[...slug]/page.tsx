import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metadataSEO } from "@/app/metadata";
import { FeedbackWrapper } from "@/components/feedback-wrapper";
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
import { DocsPageHeader, Toc, TocWrapper } from "@/components/layout";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";
import { PATTERNS_MAP } from "@/constants/patterns";
import { GITHUB_REPO_URL } from "@/constants/project";
import {
	generateStaticParams as generateContentParams,
	getPage,
	getPages,
} from "@/lib/content";
import { compileMDXContent } from "@/lib/mdx";
import { applyPatternPageSourceTransforms } from "@/lib/pattern-page-source";
import { getPatternSkill, globalPatternSkill } from "@/lib/pattern-skills";
import { resolveOgImageUrl } from "@/lib/resolve-og-image";
import { siteConfig } from "@/lib/site.config";
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

	const page = getPage(params.slug);
	if (!page) notFound();

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
	const patternCategoryLabel =
		params.slug[1] && params.slug[1] in PATTERNS_MAP
			? PATTERNS_MAP[params.slug[1] as keyof typeof PATTERNS_MAP].name
			: undefined;
	const sectionLabels: Record<string, string> = {
		patterns: "Patterns",
		"pattern-guide": "Guides",
		glossary: "Glossary",
		blog: "Blog",
		pages: "Pages",
	};
	const visibleBreadcrumbs: { label: string; href?: string }[] = [
		{ label: "Home", href: "/" },
		...params.slug.map((segment, index) => {
			const isLast = index === params.slug.length - 1;
			const href = isLast
				? undefined
				: `/${params.slug.slice(0, index + 1).join("/")}`;
			const label = isLast
				? page.title
				: index === 0
					? (sectionLabels[segment] ?? page.title)
					: params.slug[0] === "patterns" && index === 1 && patternCategoryLabel
						? patternCategoryLabel
						: segment.charAt(0).toUpperCase() +
							segment.slice(1).replace(/-/g, " ");

			return { label, href };
		}),
	];

	const title = page.title || "UX Patterns for Devs";
	const description = page.description || "";
	const path = `/${params.slug?.join("/") || ""}`;
	const patternSkill = isPatternPage ? getPatternSkill(page.slug) : undefined;

	// Compile MDX content from raw file using next-mdx-remote
	const { content: mdxContent } = await compileMDXContent(
		page.slug,
		getMDXComponents(),
		isPatternPage && patternSkill
			? {
					sourceTransform: (source) =>
						applyPatternPageSourceTransforms(source, {
							useWithAI: {
								patternTitle: page.title,
								patternSkillSlug: patternSkill.skillSlug,
								patternSkillInstallCommand: patternSkill.installCommand,
								globalSkillSlug: globalPatternSkill.skillSlug,
								globalSkillInstallCommand: globalPatternSkill.installCommand,
								markdownUrl: `${page.url}.mdx`,
							},
							quickDecision: {
								bestFor: page.bestFor,
								avoidWhen: page.avoidWhen,
								compareWith: page.compareWith,
								complexity: page.complexity,
								accessibilityRisk: page.accessibilityRisk,
							},
						}),
				}
			: undefined,
	);

	// Generate appropriate schemas based on page type
	const schemas: Record<string, unknown>[] = [];

	if (isHomepage) {
		// Homepage gets WebSite and Organization schemas
		schemas.push(generateWebSiteSchema());
		schemas.push({ "@context": "https://schema.org", ...ORGANIZATION_SCHEMA });
	} else if (isBlogPost) {
		// Blog posts get BlogPosting schema
		const datePublished = page.date || page.datePublished;
		const dateModified =
			page.lastModified || page.dateModified || datePublished;
		const tags = page.tags || page.keywords || [];

		schemas.push(
			generateBlogPostingSchema(
				title,
				description,
				path,
				undefined, // image
				datePublished,
				dateModified,
				tags,
				page.metadata?.wordCount,
			),
		);
	} else if (isBlogListing) {
		// Blog listing gets CollectionPage schema
		const allPages = getPages();
		const blogPages = allPages.filter(
			(p) => p.slugAsParams[0] === "blog" && p.slugAsParams.length > 1,
		);

		const items = blogPages.map((p) => {
			return {
				name: p.title || "",
				url: p.url,
				datePublished: p.date || p.datePublished || undefined,
				description: p.description || "",
			};
		});

		schemas.push(generateCollectionPageSchema(title, description, path, items));
	} else if (isPatternPage) {
		// Pattern pages get both Article and HowTo schemas
		const category = params.slug[1];

		// Generate HowTo steps from metadata or default steps
		const steps = page.steps || [
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
				page.totalTime || "PT30M",
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
				page.datePublished || undefined,
				page.dateModified || undefined,
				category,
				page.metadata?.wordCount,
			),
		);
	} else if (isPatternCategory || isPatternsIndex) {
		// Pattern category/listing pages get ItemList schema
		const allPages = getPages();
		const patternPages = allPages.filter(
			(p) => p.slugAsParams[0] === "patterns" && p.slugAsParams.length > 1,
		);

		const items = patternPages.map((p, index) => ({
			name: p.title || "",
			url: p.url,
			description: p.description || "",
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
				page.educationalLevel,
				page.timeRequired,
				page.prerequisites,
			),
		);
	} else if (isGlossaryPage) {
		// Glossary pages get DefinedTerm schema
		const jsonLdData = {
			"@context": "https://schema.org",
			"@type": "DefinedTerm",
			name: page.title,
			description: page.description,
			url: `${siteConfig.url}${page.url}`,
			inDefinedTermSet: {
				"@type": "DefinedTermSet",
				name: "UX Patterns Glossary",
				url: `${siteConfig.url}/glossary`,
			},
			...(page.category &&
				Array.isArray(page.category) &&
				page.category.length > 0 && {
					termCode: page.category.join(","),
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
			{schemas.map((schema) => (
				<JsonLd key={`schema-${JSON.stringify(schema)}`} data={schema} />
			))}

			<article className="space-y-6">
				<DocsPageHeader
					title={page.title}
					description={page.description}
					breadcrumbs={visibleBreadcrumbs}
					readTime={page.readTime}
					lastUpdated={page.dateModified || page.lastModified}
					aliases={page.aliases}
					popularity={page.popularity}
					actions={
						<div className="rounded-2xl border border-border/70 bg-background/80 p-2">
							<div className="flex flex-row gap-2">
								<LLMCopyButton markdownUrl={`${page.url}.mdx`} />
								<ViewOptions
									markdownUrl={`${page.url}.mdx`}
									githubUrl={`${GITHUB_REPO_URL}content/${page.slug}.mdx`}
								/>
							</div>
						</div>
					}
				/>

				{/* Content + TOC flex container */}
				<div className="flex gap-8 pt-6">
					{/* Main content */}
					<div className="min-w-0 flex-1 rounded-[2rem] border border-border/70 bg-card/75 px-6 py-7 backdrop-blur sm:px-8 sm:py-8">
						<div className="prose prose-slate dark:prose-invert max-w-none min-w-0">
							{mdxContent}
						</div>
					</div>

					{/* Table of Contents (desktop only) - hidden for pattern guides */}
					{!isPatternGuide && page.toc && page.toc.length > 0 && (
						<TocWrapper>
							<Toc items={page.toc} />
						</TocWrapper>
					)}
				</div>

				<FeedbackWrapper />
			</article>
		</>
	);
}

export async function generateStaticParams() {
	return generateContentParams();
}

export async function generateMetadata(props: {
	params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
	const params = await props.params;
	const page = getPage(params.slug);
	if (!page) notFound();

	// Determine page type and properties
	const isHomepage = !params.slug || params.slug.length === 0;
	const isBlogPost = params.slug[0] === "blog" && params.slug.length > 1;
	const isPatternPage = params.slug[0] === "patterns" && params.slug.length > 2;
	const isGlossaryPage =
		params.slug[0] === "glossary" && params.slug.length > 1;

	const title = page.title || "UX Patterns for Devs";
	const description = page.description || "";
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
	const ogImageUrl = resolveOgImageUrl({
		isHomepage,
		isPatternPage,
		pageOgImage: page.ogImage,
		patternSlug: params.slug[params.slug.length - 1],
	});

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
				publishedTime: page.date || page.datePublished,
				modifiedTime: page.lastModified || page.dateModified,
				authors: ["David Dias"],
				tags: page.tags || page.keywords || [],
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
