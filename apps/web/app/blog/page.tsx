import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import { TagFilter } from "@/components/tag-filter";
import { source } from "@/lib/source";
import { formatDate } from "@/utils/date";

interface BlogData {
	title: string;
	description: string;
	date: string;
	tags?: string[];
	featured?: boolean;
	readTime?: string;
	author?: string;
	authorImage?: string;
	thumbnail?: string;
}

interface BlogPage {
	url: string;
	data: BlogData;
}

export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<{ tag?: string }>;
}) {
	const resolvedSearchParams = await searchParams;
	const allPages = source.getPages() as any[];
	const sortedBlogs = allPages.filter(
		(page) => page.url.startsWith("/blog/") && page.url !== "/blog",
	);
	sortedBlogs.sort((a, b) => {
		const dateA = new Date(a.data.date).getTime();
		const dateB = new Date(b.data.date).getTime();
		return dateB - dateA;
	});

	const allTags = [
		"All",
		...Array.from(
			new Set(sortedBlogs.flatMap((blog) => blog.data.tags || [])),
		).sort(),
	];

	const selectedTag = resolvedSearchParams.tag || "All";
	const filteredBlogs =
		selectedTag === "All"
			? sortedBlogs
			: sortedBlogs.filter((blog) => blog.data.tags?.includes(selectedTag));

	const tagCounts = allTags.reduce(
		(acc, tag) => {
			if (tag === "All") {
				acc[tag] = sortedBlogs.length;
			} else {
				acc[tag] = sortedBlogs.filter((blog) =>
					blog.data.tags?.includes(tag),
				).length;
			}
			return acc;
		},
		{} as Record<string, number>,
	);

	return (
		<div className="min-h-screen relative">
			<div className="border-b border-border/70 p-6 relative z-10">
				<div className="mx-auto flex min-h-[240px] max-w-7xl flex-col justify-center gap-6 rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,250,249,0.82))] px-8 py-10 dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_20%),linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.72))]">
					<div className="flex flex-col gap-2">
						<p className="font-display text-sm italic text-muted-foreground">
							Blog
						</p>
						<h1 className="font-medium text-4xl md:text-5xl tracking-tighter">
							Writing around patterns, product choices, and interface work
						</h1>
						<p className="max-w-3xl text-muted-foreground text-sm md:text-base lg:text-lg leading-7">
							Notes from the work behind UX Patterns for Developers: launches,
							design trade-offs, and practical thinking about building better
							interfaces.
						</p>
					</div>
					{allTags.length > 0 && (
						<TagFilter
							tags={allTags}
							selectedTag={selectedTag}
							tagCounts={tagCounts}
						/>
					)}
				</div>
			</div>

			<div className="max-w-7xl mx-auto w-full px-6 py-8">
				<Suspense fallback={<div>Loading articles...</div>}>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{filteredBlogs.map((blog) => {
							const date = new Date(blog.data.date);
							const formattedDate = formatDate(date);

							return (
								<BlogCard
									key={blog.url}
									url={blog.url}
									title={blog.data.title}
									description={blog.data.description}
									date={formattedDate}
									thumbnail={blog.data.thumbnail}
									showRightBorder={false}
								/>
							);
						})}
					</div>
				</Suspense>
			</div>
		</div>
	);
}

import { siteConfig } from "@/lib/site.config";

export const metadata: Metadata = {
	title: `${siteConfig.pages.blog.title} | ${siteConfig.shortName}`,
	description: siteConfig.pages.blog.description,
	keywords: siteConfig.pages.blog.keywords,
	alternates: {
		canonical: `${siteConfig.url}/blog`,
	},
	openGraph: {
		title: `${siteConfig.pages.blog.title} | ${siteConfig.shortName}`,
		description: siteConfig.pages.blog.description,
		url: `${siteConfig.url}/blog`,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				type: "image/png",
			},
		],
	},
	twitter: {
		title: `${siteConfig.pages.blog.title} | ${siteConfig.shortName}`,
		description: siteConfig.pages.blog.description,
		images: [
			{
				url: siteConfig.ogImage,
				alt: `${siteConfig.pages.blog.title} - ${siteConfig.name}`,
			},
		],
	},
};
