import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GalleryClient } from "@/components/common/gallery-client";
import { loadEntries } from "@/lib/loadEntries";
import {
	getFaviconUrl,
	getWebsiteDescription,
	getWebsiteName,
} from "@/lib/loadWebsites";

interface WebsitePageProps {
	params: Promise<{ website: string }>;
}

export async function generateMetadata({
	params,
}: WebsitePageProps): Promise<Metadata> {
	const { website } = await params;
	const websiteUrl = decodeURIComponent(website);
	const websiteName = getWebsiteName(websiteUrl);
	const websiteDescription = getWebsiteDescription(websiteUrl);

	return {
		title: `${websiteName} - UX Patterns`,
		description:
			websiteDescription ||
			`Browse UX design patterns and examples from ${websiteName}`,
	};
}

export async function generateStaticParams() {
	const allEntries = await loadEntries();
	const websites = new Set(allEntries.map((entry) => entry.website));

	return Array.from(websites).map((website) => ({
		website: encodeURIComponent(website),
	}));
}

export default async function WebsiteDetailPage({ params }: WebsitePageProps) {
	const { website } = await params;
	const websiteUrl = decodeURIComponent(website);

	const allEntries = await loadEntries();
	const websiteEntries = allEntries.filter(
		(entry) => entry.website === websiteUrl,
	);

	if (websiteEntries.length === 0) {
		notFound();
	}

	const websiteName = getWebsiteName(websiteUrl);
	const websiteDescription = getWebsiteDescription(websiteUrl);
	const doCount = websiteEntries.filter((entry) => entry.type === "do").length;
	const dontCount = websiteEntries.filter(
		(entry) => entry.type === "dont",
	).length;

	return (
		<div className="min-h-screen">
			{/* Website Header */}
			<div className="bg-fd-card border-b border-fd-border">
				<div className="container-responsive py-8">
					<div className="mb-6">
						<div className="flex items-center gap-4 mb-2">
							{/* biome-ignore lint/performance/noImgElement: favicon from external URL */}
							<img
								src={getFaviconUrl(websiteUrl)}
								alt={`${websiteName} favicon`}
								className="w-8 h-8 rounded-sm flex-shrink-0"
							/>
							<h1 className="text-2xl font-bold text-fd-foreground">
								{websiteName}
							</h1>
						</div>
						<p className="text-fd-muted-foreground mb-4">
							{websiteDescription ||
								`UX design patterns and examples from ${websiteName}`}
						</p>

						{/* Stats */}
						<div className="flex items-center gap-4">
							<span className="text-sm text-fd-muted-foreground">
								{websiteEntries.length}{" "}
								{websiteEntries.length === 1 ? "example" : "examples"}
							</span>
							{doCount > 0 && (
								<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
									{doCount} Do
								</span>
							)}
							{dontCount > 0 && (
								<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
									{dontCount} Don't
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Results */}
			<div className="container-responsive py-8">
				<Suspense
					fallback={
						<div className="text-fd-muted-foreground">Loading gallery...</div>
					}
				>
					<GalleryClient entries={websiteEntries} />
				</Suspense>
			</div>
		</div>
	);
}
