import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { DisclaimerBanner } from "@/components/common/disclaimer-banner";
import { ImageWithVerdict } from "@/components/common/image-with-verdict";
import { PatternBadge } from "@/components/common/pattern-badge";
import { PlatformBadge } from "@/components/common/platform-badge";
import { ShareButton } from "@/components/common/share-button";
import { VerdictChip } from "@/components/common/verdict-chip";
import { WebsitePill } from "@/components/common/website-pill";
import { getImagePath } from "@/lib/image-utils";
import { getEntryWithBody, loadEntries } from "@/lib/loadEntries";
import { useMDXComponents } from "@/lib/mdx-components";
import type { Entry } from "@/lib/types";
import { buildBreadcrumbs, getCategoryForPattern } from "@/lib/url-utils";

export const runtime = "nodejs";
export const dynamic = "force-static";

interface PageProps {
	params: Promise<{
		platform: string;
		category: string;
		pattern: string;
		quality: string;
		id: string;
	}>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { platform, category, pattern, quality, id } = await params;

	// Get the specific entry
	const entry = getEntryWithBody(id);
	if (!entry) {
		return {
			title: "Pattern Not Found",
		};
	}

	const qualityText = quality === "do" ? "Good" : "Bad";
	const title = entry.title;
	const description = `${qualityText} example of ${entry.pattern} pattern from ${entry.website}. Educational UX pattern example for developers.`;
	const url = `https://gallery.uxpatterns.dev/${platform}/${category}/${pattern}/${quality}/${id}`;
	const imageUrl = `https://gallery.uxpatterns.dev${getImagePath(entry)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url,
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 800,
					alt: entry.title,
				},
			],
		},
		twitter: {
			title,
			description,
			images: [imageUrl],
		},
	};
}

export default async function PatternDetailPage({ params }: PageProps) {
	const { platform, category, pattern, quality, id } = await params;

	// Load all entries for filtering
	const allEntries = await loadEntries();

	// Get the specific entry with MDX body for rendering
	const entryWithBody = getEntryWithBody(id);
	if (!entryWithBody) {
		notFound();
	}
	const entry = entryWithBody; // Use entry with body

	// Initialize MDX components at top level
	const mdxComponents = useMDXComponents({});

	// Validate URL matches entry properties
	const normalizedPattern = entry.pattern.toLowerCase().replace(/\s+/g, "-");
	if (
		entry.platform !== platform ||
		normalizedPattern !== pattern ||
		entry.type !== quality
	) {
		notFound();
	}

	// Get related entries (same pattern, different examples)
	const relatedEntries = allEntries
		.filter(
			(e: Entry) =>
				e.pattern === entry.pattern &&
				e.id !== entry.id &&
				e.platform === entry.platform,
		)
		.slice(0, 4);

	// Get navigation entries (previous and next in the same filter)
	const filteredEntries = allEntries.filter(
		(e: Entry) =>
			e.platform === platform &&
			e.pattern === entry.pattern &&
			e.type === quality,
	);
	const currentIndex = filteredEntries.findIndex((e: Entry) => e.id === id);
	const previousEntry =
		currentIndex > 0 ? filteredEntries[currentIndex - 1] : null;
	const nextEntry =
		currentIndex < filteredEntries.length - 1
			? filteredEntries[currentIndex + 1]
			: null;

	// Build breadcrumbs
	const breadcrumbs = [
		...buildBreadcrumbs({
			platform: platform as "web" | "mobile",
			category,
			pattern,
			quality: quality as "do" | "dont",
		}),
		// Add the entry title as the last breadcrumb
		{
			label: entry.title,
			href: `/${platform}/${category}/${pattern}/${quality}/${id}`,
		},
	];

	return (
		<div className="min-h-screen">
			<div className="container-responsive py-8">
				{/* Main content - single column with max width */}
				<div className="max-w-5xl mx-auto">
					{/* 1. Breadcrumb */}
					<div className="mb-6">
						<Breadcrumb items={breadcrumbs} />
					</div>

					{/* 2. Pattern badge */}
					<div className="flex flex-wrap items-center gap-2 mb-4">
						<PatternBadge pattern={entry.pattern} platform={entry.platform} />
					</div>

					{/* 3. H1 Title with Share Button */}
					<div className="flex items-start justify-between gap-4 mb-6">
						<h1 className="text-3xl font-bold text-fd-foreground">
							{entry.title}
						</h1>
						<ShareButton
							title={entry.title}
							text={`${entry.type === "do" ? "Good" : "Bad"} ${entry.pattern} pattern example from ${entry.website}`}
						/>
					</div>

					{/* 4. Picture with verdict ribbon */}
					<div className="mx-auto max-w-4xl mb-6">
						{entry.media.type === "image" ? (
							<ImageWithVerdict
								alt={entry.title}
								type={entry.type}
								entry={entry}
							/>
						) : (
							<div className="relative aspect-[4/3] bg-fd-background rounded-xl overflow-hidden">
								<div className="flex items-center justify-center h-full text-fd-muted-foreground">
									<span>Video content</span>
								</div>
							</div>
						)}

						{/* Navigation arrows */}
						<div className="flex justify-between items-center mt-4">
							{previousEntry ? (
								<Link
									href={`/${platform}/${category}/${pattern}/${quality}/${previousEntry.id}`}
									className="flex items-center gap-2 px-4 py-2 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted rounded-lg transition-colors"
								>
									<ArrowLeft className="w-4 h-4" />
									<span>Previous</span>
								</Link>
							) : (
								<div />
							)}

							{nextEntry ? (
								<Link
									href={`/${platform}/${category}/${pattern}/${quality}/${nextEntry.id}`}
									className="flex items-center gap-2 px-4 py-2 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted rounded-lg transition-colors"
								>
									<span>Next</span>
									<ArrowRight className="w-4 h-4" />
								</Link>
							) : (
								<div />
							)}
						</div>
					</div>

					{/* 5. Website, Platform and Link */}
					<div className="bg-fd-card border border-fd-border rounded-xl p-6 mb-8">
						<div className="flex flex-wrap items-center gap-6">
							<div>
								<span className="text-sm text-fd-muted-foreground block mb-1">
									Website
								</span>
								<WebsitePill
									website={entry.website}
									platform={entry.platform}
								/>
							</div>

							<div>
								<span className="text-sm text-fd-muted-foreground block mb-1">
									Platform
								</span>
								<PlatformBadge platform={entry.platform} />
							</div>

							{entry.source?.url && (
								<a
									href={entry.source.url}
									target="_blank"
									rel="noopener noreferrer nofollow"
									className="inline-flex items-center gap-2 px-4 py-2 bg-fd-primary text-fd-primary-foreground rounded-lg hover:bg-fd-primary/90 transition-colors ml-auto"
								>
									<span>View on {entry.website}</span>
									<ExternalLink className="w-4 h-4" />
								</a>
							)}
						</div>
					</div>

					{/* 6. Analysis/Description */}
					{(entry.body || entry.content) && (
						<div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
							<h2>Analysis</h2>
							{entry.body ? (
								<div className="prose-content">
									<entry.body components={mdxComponents} />
								</div>
							) : (
								<p>{entry.content}</p>
							)}
						</div>
					)}

					{/* 7. Tags */}
					{entry.tags && entry.tags.length > 0 && (
						<div className="mb-8">
							<h3 className="text-lg font-semibold mb-3">Tags</h3>
							<div className="flex flex-wrap gap-2">
								{entry.tags.map((tag: string) => (
									<span
										key={tag}
										className="px-3 py-1 bg-fd-muted text-fd-muted-foreground rounded-full text-sm"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Related examples */}
					{relatedEntries.length > 0 && (
						<div className="border-t border-fd-border pt-8 mt-12">
							<h3 className="text-xl font-semibold mb-6">
								More {entry.pattern} examples
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								{relatedEntries.map((related: Entry) => (
									<Link
										key={related.id}
										href={`/${related.platform}/${category}/${pattern}/${related.type}/${related.id}`}
										className="group block rounded-xl bg-fd-card border border-fd-border overflow-hidden hover:border-fd-border/80 hover:shadow-lg transition-all duration-200"
									>
										<div className="relative aspect-[4/3] bg-fd-background overflow-hidden">
											{related.media.type === "image" && (
												<Image
													src={getImagePath(related)}
													alt={related.title}
													fill
													className="object-contain group-hover:scale-105 transition-transform duration-300"
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
												/>
											)}
											<div className="absolute top-2 right-2">
												<VerdictChip type={related.type} variant="overlay" />
											</div>
										</div>
										<div className="p-3">
											<div className="font-medium text-sm text-fd-foreground line-clamp-2 group-hover:text-fd-primary transition-colors">
												{related.title}
											</div>
											<div className="text-xs text-fd-muted-foreground mt-1">
												{related.website}
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					)}

					{/* Disclaimer Banner */}
					<DisclaimerBanner className="mb-6" />
				</div>
			</div>
		</div>
	);
}

// Generate static params for all entries
export async function generateStaticParams() {
	const entries = await loadEntries();

	return entries.map((entry: Entry) => {
		const normalizedPattern = entry.pattern.toLowerCase().replace(/\s+/g, "-");
		const category = getCategoryForPattern(normalizedPattern) || "navigation";

		return {
			platform: entry.platform,
			category,
			pattern: normalizedPattern,
			quality: entry.type,
			id: entry.id,
		};
	});
}
