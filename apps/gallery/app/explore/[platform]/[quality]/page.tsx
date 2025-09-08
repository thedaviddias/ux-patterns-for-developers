import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GalleryClient } from "@/components/common/gallery-client";
import { Filters } from "@/components/filters/filters";
import { getUniquePatterns, loadEntries } from "@/lib/loadEntries";
import { searchEntries } from "@/lib/search";

interface PlatformQualityPageProps {
	params: Promise<{ platform: string; quality: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
	params,
}: PlatformQualityPageProps): Promise<Metadata> {
	const { platform, quality } = await params;

	const platformNames: Record<string, string> = {
		web: "Web",
		mobile: "Mobile",
		all: "All Platforms",
	};

	const qualityNames: Record<string, string> = {
		do: "Do",
		dont: "Don't",
		all: "All Quality",
	};

	const platformName = platformNames[platform] || platform;
	const qualityName = qualityNames[quality] || quality;

	return {
		title: `${qualityName} ${platformName} UX Patterns`,
		description: `Browse ${qualityName.toLowerCase()} ${platformName.toLowerCase()} UX patterns and examples`,
	};
}

export async function generateStaticParams() {
	return [
		{ platform: "web", quality: "do" },
		{ platform: "web", quality: "dont" },
		{ platform: "web", quality: "all" },
		{ platform: "mobile", quality: "do" },
		{ platform: "mobile", quality: "dont" },
		{ platform: "mobile", quality: "all" },
		{ platform: "all", quality: "do" },
		{ platform: "all", quality: "dont" },
		{ platform: "all", quality: "all" },
	];
}

export default async function PlatformQualityPage({
	params,
	searchParams,
}: PlatformQualityPageProps) {
	const { platform, quality } = await params;
	const searchParamsResolved = await searchParams;

	// Validate platform and quality
	if (
		!["web", "mobile", "all"].includes(platform) ||
		!["do", "dont", "all"].includes(quality)
	) {
		notFound();
	}

	const allEntries = await loadEntries();
	const patterns = getUniquePatterns(allEntries);

	// Apply filters - platform and quality are determined by URL
	const filteredEntries = searchEntries(
		allEntries,
		searchParamsResolved.search || "",
		{
			platform: platform === "all" ? undefined : platform,
			type: quality === "all" ? undefined : quality,
			pattern: searchParamsResolved.pattern,
		},
	);

	const platformNames: Record<string, string> = {
		web: "Web",
		mobile: "Mobile",
		all: "All Platforms",
	};

	const qualityNames: Record<string, string> = {
		do: "Do",
		dont: "Don't",
		all: "All Quality",
	};

	return (
		<div className="min-h-screen">
			{/* Header */}
			<div className="bg-fd-card border-b border-fd-border py-8">
				<div className="container-responsive">
					<h1 className="text-3xl font-bold text-fd-foreground">
						{qualityNames[quality]} {platformNames[platform]} UX Patterns
					</h1>
					<p className="text-fd-muted-foreground mt-2">
						Browse {qualityNames[quality].toLowerCase()}{" "}
						{platformNames[platform].toLowerCase()} UX patterns and examples
					</p>
				</div>
			</div>

			{/* Filters */}
			<Suspense
				fallback={<div className="h-20 bg-fd-card border-b border-fd-border" />}
			>
				<Filters patterns={patterns} variant="search" />
			</Suspense>

			{/* Results */}
			<div className="container-responsive py-8">
				<GalleryClient entries={filteredEntries} />
			</div>
		</div>
	);
}
