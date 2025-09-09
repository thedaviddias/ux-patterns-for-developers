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
	const allPages = source.getPages() as BlogPage[];
	const sortedBlogs = allPages.filter(
		(page) => page.url.startsWith("/blog/") && page.url !== "/blog",
	);
	allPages.sort((a, b) => {
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
		<div className="min-h-screen bg-background relative">
			<div className="p-6 border-b border-border flex flex-col gap-6 min-h-[200px] justify-center relative z-10">
				<div className="max-w-7xl mx-auto w-full">
					<div className="flex flex-col gap-2">
						<h1 className="font-medium text-4xl md:text-5xl tracking-tighter">
							Blog
						</h1>
						<p className="text-muted-foreground text-sm md:text-base lg:text-lg">
							Latest news and updates from UX Patterns for Developers.
						</p>
					</div>
				</div>
				{allTags.length > 0 && (
					<div className="max-w-7xl mx-auto w-full">
						<TagFilter
							tags={allTags}
							selectedTag={selectedTag}
							tagCounts={tagCounts}
						/>
					</div>
				)}
			</div>

			<div className="max-w-7xl mx-auto w-full px-6 lg:px-0">
				<Suspense fallback={<div>Loading articles...</div>}>
					<div
						className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative overflow-hidden border-x border-border ${
							filteredBlogs.length < 4 ? "border-b" : "border-b-0"
						}`}
					>
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
									showRightBorder={filteredBlogs.length < 3}
								/>
							);
						})}
					</div>
				</Suspense>
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Blog | UX Patterns for Devs",
	description: "Latest news and updates from UX Patterns for Developers.",
	openGraph: {
		title: "Blog | UX Patterns for Devs",
		description: "Latest news and updates from UX Patterns for Developers.",
		url: "https://uxpatterns.dev/blog",
		images: [
			{
				url: "/og/opengraph-image.png",
				width: 1200,
				height: 630,
				type: "image/png",
			},
		],
	},
	twitter: {
		title: "Blog | UX Patterns for Devs",
		description: "Latest news and updates from UX Patterns for Developers.",
		images: [
			{
				url: "/og/opengraph-image.png",
				alt: "Blog - UX Patterns for Developers",
			},
		],
	},
};
