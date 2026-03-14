import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import { formatDate } from "@/utils/date";

interface BlogHighlightsProps {
	posts: BlogPost[];
}

export function BlogHighlights({ posts }: BlogHighlightsProps) {
	if (posts.length === 0) {
		return null;
	}

	const [leadPost, ...restPosts] = posts;

	return (
		<section
			aria-labelledby="blog-highlights-heading"
			className="py-16 sm:py-18 lg:py-20"
		>
			<div className="container mx-auto px-6">
				<div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="font-display text-sm italic text-muted-foreground">
							Editorial context
						</p>
						<h2
							id="blog-highlights-heading"
							className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl"
						>
							What we are thinking about right now
						</h2>
					</div>
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
					>
						Read the blog
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				<div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
					<Link
						href={leadPost.url}
						className="group overflow-hidden rounded-[2rem] border border-border/70 bg-card"
					>
						<div className="grid h-full lg:grid-cols-[1.1fr_0.9fr]">
							<div className="specimen-surface relative min-h-[280px] overflow-hidden border-b border-specimen-border lg:min-h-full lg:border-b-0 lg:border-r">
								{leadPost.thumbnail || leadPost.image ? (
									<Image
										src={leadPost.thumbnail || leadPost.image || ""}
										alt={leadPost.title}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-105"
										sizes="(max-width: 1280px) 100vw, 60vw"
									/>
								) : (
									<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.55),transparent_22%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.4),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.98))]" />
								)}
							</div>
							<div className="flex flex-col justify-between p-8">
								<div>
									<div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
										<span>{formatDate(new Date(leadPost.date))}</span>
										{leadPost.tags?.[0] && <span>{leadPost.tags[0]}</span>}
									</div>
									<h3 className="max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
										{leadPost.title}
									</h3>
									<p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
										{leadPost.description}
									</p>
								</div>
								<div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
									Read article
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</div>
							</div>
						</div>
					</Link>

					<div className="grid gap-4">
						{restPosts.map((post) => (
							<Link
								key={post.slug}
								href={post.url}
								className="group rounded-[1.75rem] border border-border/70 bg-card/90 p-6 transition-all duration-200 hover:border-foreground/20 hover:-translate-y-0.5"
							>
								<div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
									<span>{formatDate(new Date(post.date))}</span>
									{post.tags?.[0] && <span>{post.tags[0]}</span>}
								</div>
								<h3 className="text-2xl font-semibold text-foreground">
									{post.title}
								</h3>
								<p className="mt-3 text-sm leading-6 text-muted-foreground">
									{post.description}
								</p>
								<div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
									Read article
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
