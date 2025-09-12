import { Button } from "@ux-patterns/ui/components/shadcn/button";
import { DocsBody } from "fumadocs-ui/page";
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
import { getAuthor, isValidAuthor } from "@/lib/authors";
import { siteConfig } from "@/lib/site.config";
import { source } from "@/lib/source";
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

	const page = source.getPage(["blog", slug]);

	if (!page) {
		notFound();
	}

	const MDX = page.data.body;
	const date = new Date(page.data.date || Date.now());
	const formattedDate = formatDate(date);

	// Generate schemas
	const schemas = [
		generateBlogPostingSchema(
			page.data.title || "Blog Post",
			page.data.description || "",
			`/blog/${slug}`,
			page.data.thumbnail,
			page.data.date instanceof Date
				? page.data.date.toISOString()
				: page.data.date ||
						(page.data.datePublished instanceof Date
							? page.data.datePublished.toISOString()
							: page.data.datePublished),
			page.data.lastModified instanceof Date
				? page.data.lastModified.toISOString()
				: page.data.lastModified ||
						(page.data.dateModified instanceof Date
							? page.data.dateModified.toISOString()
							: page.data.dateModified),
			page.data.tags || page.data.keywords || [],
			page.data.wordCount,
		),
		generateBreadcrumbSchema([
			{ name: "Home", url: "/" },
			{ name: "Blog", url: "/blog" },
			{ name: page.data.title || "Article", url: `/blog/${slug}` },
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
			<div className="min-h-screen bg-background relative">
				<HashScrollHandler />

				<div className="space-y-4 border-b border-border relative z-10">
					<div className="max-w-7xl mx-auto flex flex-col gap-6 p-6">
						<div className="flex flex-wrap items-center gap-3 gap-y-5 text-sm text-muted-foreground">
							<Button variant="outline" asChild className="h-6 w-6">
								<Link href="/blog">
									<ArrowLeft className="w-4 h-4" />
									<span className="sr-only">Back to all articles</span>
								</Link>
							</Button>
							{page.data.tags && page.data.tags.length > 0 && (
								<div className="flex flex-wrap gap-3 text-muted-foreground">
									{page.data.tags.map((tag: string) => (
										<span
											key={tag}
											className="h-6 w-fit px-3 text-sm font-medium bg-muted text-muted-foreground rounded-md border flex items-center justify-center"
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

						<h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-balance">
							{page.data.title}
						</h1>

						{page.data.description && (
							<p className="text-muted-foreground max-w-4xl md:text-lg md:text-balance">
								{page.data.description}
							</p>
						)}
					</div>
				</div>
				<div className="flex divide-x divide-border relative max-w-7xl mx-auto px-4 md:px-0 z-10">
					<div className="absolute max-w-7xl mx-auto left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] lg:w-full h-full border-x border-border p-0 pointer-events-none" />
					<main className="w-full p-0 overflow-hidden">
						{page.data.thumbnail && (
							<div className="relative w-full h-[500px] overflow-hidden object-cover border border-transparent">
								<Image
									src={page.data.thumbnail}
									alt={page.data.title || ""}
									fill
									className="object-cover"
									priority
								/>
							</div>
						)}
						<div className="p-6 lg:p-10">
							<div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance prose-lg">
								<DocsBody>
									<MDX />
								</DocsBody>
							</div>
						</div>
						<div className="mt-10">
							<ReadMoreSection
								currentSlug={[slug]}
								currentTags={page.data.tags}
							/>
						</div>
					</main>

					<aside className="hidden lg:block w-[350px] flex-shrink-0 p-6 lg:p-10 bg-muted/60 dark:bg-muted/20">
						<div className="sticky top-20 space-y-8">
							{page.data.author && isValidAuthor(page.data.author) && (
								<AuthorCard author={getAuthor(page.data.author)} />
							)}
							<div className="border border-border rounded-lg p-6 bg-card">
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

	const page = source.getPage(["blog", slug]);

	if (!page) {
		return metadataSEO;
	}

	const title = page.data.title || "Blog Post";
	const description =
		page.data.description || "A blog post from UX Patterns for Developers.";
	const url = `${siteConfig.url}/blog/${slug}`;

	return {
		...metadataSEO,
		title,
		description,
		keywords: page.data.tags || page.data.keywords || metadataSEO.keywords,
		authors: page.data.author
			? [{ name: page.data.author }]
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
			publishedTime:
				page.data.date instanceof Date
					? page.data.date.toISOString()
					: page.data.date ||
						(page.data.datePublished instanceof Date
							? page.data.datePublished.toISOString()
							: page.data.datePublished),
			modifiedTime:
				page.data.lastModified instanceof Date
					? page.data.lastModified.toISOString()
					: page.data.lastModified ||
						(page.data.dateModified instanceof Date
							? page.data.dateModified.toISOString()
							: page.data.dateModified),
			authors: page.data.author ? [page.data.author] : ["David Dias"],
			tags: page.data.tags || page.data.keywords || [],
			images: page.data.thumbnail
				? [
						{
							url: page.data.thumbnail,
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
			images: page.data.thumbnail
				? [
						{
							url: page.data.thumbnail,
							alt: title,
						},
					]
				: metadataSEO.twitter?.images,
		},
	};
}
