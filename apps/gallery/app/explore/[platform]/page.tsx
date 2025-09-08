import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GalleryClient } from "@/components/common/gallery-client";
import { Filters } from "@/components/filters/filters";
import { getUniquePatterns, loadEntries } from "@/lib/loadEntries";
import { searchEntries } from "@/lib/search";

interface PlatformPageProps {
	params: Promise<{ platform: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
	params,
}: PlatformPageProps): Promise<Metadata> {
	const { platform } = await params;

	const platformNames: Record<string, string> = {
		web: "Web",
		mobile: "Mobile",
		all: "All Platforms",
	};

	const platformName = platformNames[platform] || platform;

	return {
		title: `${platformName} UX Patterns`,
		description: `Browse ${platformName.toLowerCase()} UX patterns and examples`,
	};
}

export async function generateStaticParams() {
	return [{ platform: "web" }, { platform: "mobile" }, { platform: "all" }];
}

export default async function PlatformPage({
	params,
	searchParams,
}: PlatformPageProps) {
	const { platform } = await params;
	const searchParamsResolved = await searchParams;

	// Validate platform
	if (!["web", "mobile", "all"].includes(platform)) {
		notFound();
	}

	const allEntries = await loadEntries();
	const patterns = getUniquePatterns(allEntries);

	// Apply filters - platform is determined by URL
	const filteredEntries = searchEntries(
		allEntries,
		searchParamsResolved.search || "",
		{
			platform: platform === "all" ? undefined : platform,
			type: searchParamsResolved.type,
			pattern: searchParamsResolved.pattern,
		},
	);

	const platformNames: Record<string, string> = {
		web: "Web",
		mobile: "Mobile",
		all: "All Platforms",
	};

	return (
		<div className="min-h-screen">
			{/* Header */}
			<div className="bg-fd-card border-b border-fd-border py-8">
				<div className="container-responsive">
					<h1 className="text-3xl font-bold text-fd-foreground">
						{platformNames[platform]} UX Patterns
					</h1>
					<p className="text-fd-muted-foreground mt-2">
						Browse {platformNames[platform].toLowerCase()} UX patterns and
						examples
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
