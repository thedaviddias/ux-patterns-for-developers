import Link from "next/link";
import { source } from "@/lib/source";

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
	slugs: string[];
	data: BlogData;
}

interface ReadMoreSectionProps {
	currentSlug: string[];
	currentTags?: string[];
}

export function ReadMoreSection({
	currentSlug,
	currentTags = [],
}: ReadMoreSectionProps) {
	const allPages = source.getPages() as any[];

	const currentUrl = `/blog/${currentSlug.join("/")}`;

	const otherPosts = allPages
		.filter((page) => page.url !== currentUrl && page.slugs[0] === "blog")
		.map((page) => {
			const pageData = page.data as any;
			const tagOverlap = currentTags.filter((tag) =>
				pageData.tags?.includes(tag),
			).length;

			return {
				...page,
				relevanceScore: tagOverlap,
				date: new Date(pageData.date),
			};
		})
		.sort((a, b) => {
			if (a.relevanceScore !== b.relevanceScore) {
				return b.relevanceScore - a.relevanceScore;
			}
			return b.date.getTime() - a.date.getTime();
		})
		.slice(0, 3);

	if (otherPosts.length === 0) {
		return null;
	}

	return (
		<section className="border-t border-border p-0">
			<div className="p-6 lg:p-10">
				<h2 className="text-2xl font-medium mb-8">Read more</h2>

				<div className="flex flex-col gap-8">
					{otherPosts.map((post) => {
						return (
							<Link
								key={post.url}
								href={post.url}
								className="group grid grid-cols-1 lg:grid-cols-12 items-center gap-4 cursor-pointer"
							>
								{post.data.thumbnail && (
									<div className="flex-shrink-0 col-span-1 lg:col-span-4">
										<div className="relative w-full h-full">
											{/** biome-ignore lint/performance/noImgElement: no need to optimize */}
											<img
												src={post.data.thumbnail}
												alt={post.data.title}
												className="w-full h-full object-cover rounded-lg group-hover:opacity-80 transition-opacity"
											/>
										</div>
									</div>
								)}
								<div className="space-y-2 flex-1 col-span-1 lg:col-span-8">
									<h3 className="text-lg group-hover:underline underline-offset-4 font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
										{post.data.title}
									</h3>
									<p className="text-muted-foreground text-sm line-clamp-3 group-hover:underline underline-offset-4">
										{post.data.description}
									</p>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
