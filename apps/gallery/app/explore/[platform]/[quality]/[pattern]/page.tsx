import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GalleryClient } from "@/components/common/gallery-client";
import { PatternHeader } from "@/components/common/pattern-header";
import { Filters } from "@/components/filters/filters";
import { getUniquePatterns, loadEntries } from "@/lib/loadEntries";
import { searchEntries } from "@/lib/search";

interface PatternPageProps {
	params: Promise<{ platform: string; quality: string; pattern: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
	params,
}: PatternPageProps): Promise<Metadata> {
	const { platform, quality, pattern } = await params;

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
	const patternName = pattern
		.replace(/-/g, " ")
		.replace(/\b\w/g, (l) => l.toUpperCase());

	return {
		title: `${patternName} - ${qualityName} ${platformName} UX Patterns`,
		description: `Browse ${patternName} UX pattern examples for ${platformName.toLowerCase()} with ${qualityName.toLowerCase()} quality`,
	};
}

export async function generateStaticParams() {
	const entries = await loadEntries();
	const patterns = getUniquePatterns(entries);

	const params: Array<{ platform: string; quality: string; pattern: string }> =
		[];

	// Generate all combinations
	const platforms = ["web", "mobile", "all"];
	const qualities = ["do", "dont", "all"];

	for (const platform of platforms) {
		for (const quality of qualities) {
			for (const pattern of patterns.filter(
				(p) => p && typeof p === "string",
			)) {
				params.push({ platform, quality, pattern });
			}
		}
	}

	return params;
}

export default async function PatternPage({
	params,
	searchParams,
}: PatternPageProps) {
	const { platform, quality, pattern } = await params;
	const searchParamsResolved = await searchParams;

	// Validate platform, quality, and pattern
	if (
		!["web", "mobile", "all"].includes(platform) ||
		!["do", "dont", "all"].includes(quality) ||
		!pattern
	) {
		notFound();
	}

	const allEntries = await loadEntries();
	const patterns = getUniquePatterns(allEntries);

	// Apply filters - platform, quality, and pattern are determined by URL
	const filteredEntries = searchEntries(
		allEntries,
		searchParamsResolved.search || "",
		{
			platform: platform === "all" ? undefined : platform,
			type: quality === "all" ? undefined : quality,
			pattern: pattern,
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

	const patternName = pattern
		.replace(/-/g, " ")
		.replace(/\b\w/g, (l) => l.toUpperCase());

	return (
		<div className="min-h-screen">
			{/* Pattern Header */}
			<PatternHeader
				pattern={patternName}
				platform={platformNames[platform]}
				quality={qualityNames[quality]}
			/>

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
