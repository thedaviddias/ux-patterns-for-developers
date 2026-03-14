import { AUTHOR } from "@ux-patterns/constants/author";
import { Button } from "@ux-patterns/ui/components/shadcn/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { metadataSEO } from "@/app/metadata";
import { AuthorCard } from "@/components/blog/author-card";
import { HashScrollHandler } from "@/components/blog/hash-scroll-handler";
import { MobileTableOfContents } from "@/components/blog/mobile-toc";
import { ReadMoreSection } from "@/components/blog/read-more-section";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { generateBlogPostingSchema, JsonLd } from "@/components/json-ld";
import { DocsBreadcrumb } from "@/components/layout";
import { getBlogPost } from "@/lib/content";
import { compileMDXContent } from "@/lib/mdx";
import { siteConfig } from "@/lib/site.config";
import { getMDXComponents } from "@/mdx-components";
import { formatDate } from "@/utils/date";
import { generateBreadcrumbSchema } from "@/utils/generate-breadcrumb-schema";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: PageProps) {
	const { slug } = await params;

	if (!slug || slug.length === 0) {
		notFound();
	}

	const page = getBlogPost(slug);

	if (!page) {
		notFound();
	}

	// Page data from Velite
	const pageData = page;

	// Compile MDX content from raw file
	const { content: mdxContent } = await compileMDXContent(
		`blog/${slug}`,
		getMDXComponents(),
	);

	const date = new Date(pageData.date || Date.now());
	const formattedDate = formatDate(date);

	// Generate schemas
	const schemas = [
		generateBlogPostingSchema(
			pageData.title || "Blog Post",
			pageData.description || "",
			`/blog/${slug}`,
			pageData.image,
			pageData.date,
			pageData.date, // Use date for both published and modified
			pageData.tags || [],
			pageData.metadata?.wordCount,
		),
		generateBreadcrumbSchema([
			{ name: "Home", url: "/" },
			{ name: "Blog", url: "/blog" },
			{ name: pageData.title || "Article", url: `/blog/${slug}` },
		]),
	];

	return (
		<>
			{/* Render JSON-LD schemas */}
			{schemas.map((schema, index) => (
				<JsonLd
					key={`${Array.isArray(schema["@type"]) ? schema["@type"].join("-") : schema["@type"]}-${index}`}
					data={schema}
				/>
			))}
			<div className="min-h-screen relative">
				<HashScrollHandler />

				<div className="relative z-10 border-b border-border/70 p-6">
					<div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2rem] border border-border/70 bg-card/85 px-8 py-8 backdrop-blur">
						<DocsBreadcrumb
							items={[
								{ label: "Home", href: "/" },
								{ label: "Blog", href: "/blog" },
								{ label: pageData.title || "Article" },
							]}
						/>
						<div className="flex flex-wrap items-center gap-3 gap-y-5 text-sm text-muted-foreground">
							<Button variant="outline" asChild className="h-8 w-8 rounded-xl">
								<Link href="/blog">
									<ArrowLeft className="w-4 h-4" />
									<span className="sr-only">Back to all articles</span>
								</Link>
							</Button>
							{pageData.tags && pageData.tags.length > 0 && (
								<div className="flex flex-wrap gap-3 text-muted-foreground">
									{pageData.tags.map((tag: string) => (
										<span
											key={tag}
											className="flex h-7 w-fit items-center justify-center rounded-xl border border-border/70 bg-background px-3 text-sm font-medium text-muted-foreground"
										>
											{tag}
										</span>
									))}
								</div>
							)}
							<time className="font-medium text-muted-foreground">
								{formattedDate}
							</time>
						</div>

						<p className="font-display text-sm italic text-muted-foreground">
							Blog
						</p>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-balance">
							{pageData.title}
						</h1>

						{pageData.description && (
							<p className="max-w-4xl text-muted-foreground md:text-lg md:text-balance leading-8">
								{pageData.description}
							</p>
						)}
					</div>
				</div>
				<div className="relative z-10 mx-auto flex max-w-7xl gap-8 px-6 py-8">
					<main className="w-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 backdrop-blur">
						{pageData.image && (
							<div className="relative h-[500px] w-full overflow-hidden border-b border-border/70 object-cover">
								<Image
									src={pageData.image}
									alt={pageData.title || ""}
									fill
									className="object-cover"
									priority
								/>
							</div>
						)}
						<div className="p-6 lg:p-10">
							<div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance prose-lg">
								{mdxContent}
							</div>
						</div>
						<div className="mt-10">
							<ReadMoreSection
								currentSlug={[slug]}
								currentTags={pageData.tags}
							/>
						</div>
					</main>

					<aside className="hidden w-[350px] flex-shrink-0 lg:block">
						<div className="sticky top-20 space-y-8">
							<div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 backdrop-blur">
								<AuthorCard
									author={{
										name: AUTHOR.name,
										position: "UX Patterns for Developers Creator",
										avatar: "/authors/thedaviddias.webp",
									}}
								/>
							</div>
							<div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 backdrop-blur">
								<TableOfContents />
							</div>
						</div>
					</aside>
				</div>

				<MobileTableOfContents />
			</div>
		</>
	);
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;

	if (!slug || slug.length === 0) {
		return metadataSEO;
	}

	const page = getBlogPost(slug);

	if (!page) {
		return metadataSEO;
	}

	// Page data from Velite
	const pageData = page;
	const title = pageData.title || "Blog Post";
	const description =
		pageData.description || "A blog post from UX Patterns for Developers.";
	const url = `${siteConfig.url}/blog/${slug}`;

	return {
		...metadataSEO,
		title,
		description,
		keywords: pageData.tags || metadataSEO.keywords,
		authors: pageData.author
			? [{ name: pageData.author }]
			: [{ name: "David Dias" }],
		alternates: {
			canonical: url,
		},
		openGraph: {
			...metadataSEO.openGraph,
			type: "article",
			title,
			description,
			url,
			publishedTime: pageData.date,
			modifiedTime: pageData.date,
			authors: pageData.author ? [pageData.author] : ["David Dias"],
			tags: pageData.tags || [],
			images: pageData.image
				? [
						{
							url: pageData.image,
							width: 1200,
							height: 630,
							type: "image/jpeg",
							alt: title,
						},
					]
				: metadataSEO.openGraph?.images,
		},
		twitter: {
			...metadataSEO.twitter,
			title,
			description,
			images: pageData.image
				? [
						{
							url: pageData.image,
							alt: title,
						},
					]
				: metadataSEO.twitter?.images,
		},
	};
}
