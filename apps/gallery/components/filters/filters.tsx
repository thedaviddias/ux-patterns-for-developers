"use client";

import {
	CheckCircle,
	Filter,
	Monitor,
	Smartphone,
	XCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { ROUTES } from "@/lib/routes";
import { useSearch } from "@/lib/search-context";
import { getCategoryForPattern, PATTERN_CATEGORIES } from "@/lib/url-utils";
import { cn } from "@/lib/utils";
import { FilterDropdown } from "./filter-dropdown";

// Convert pattern ID to display name
const getPatternDisplayName = (patternId: string): string => {
	return patternId
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

interface FiltersProps {
	patterns: string[];
	className?: string;
	variant?: "homepage" | "search";
}

export function Filters({
	patterns,
	className,
	variant = "search",
}: FiltersProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { openSearch } = useSearch();

	// Parse current filters from URL
	const getCurrentFilters = () => {
		const searchParams =
			typeof window !== "undefined"
				? new URLSearchParams(window.location.search)
				: new URLSearchParams();
		const pathParts = pathname.split("/").filter(Boolean);

		// Platform from path
		let platform: "all" | "web" | "mobile" = "all";
		if (pathParts[0] === "web") platform = "web";
		else if (pathParts[0] === "mobile") platform = "mobile";

		// Category from path (if exists)
		let category = "";
		if (
			pathParts[1] &&
			Object.keys(PATTERN_CATEGORIES).includes(pathParts[1])
		) {
			category = pathParts[1];
		}

		// Pattern from path
		let pattern = "";
		if (pathParts[2] && !["do", "dont"].includes(pathParts[2])) {
			pattern = pathParts[2];
		} else if (
			pathParts[1] &&
			!Object.keys(PATTERN_CATEGORIES).includes(pathParts[1]) &&
			!["do", "dont"].includes(pathParts[1])
		) {
			// Direct pattern without category
			pattern = pathParts[1];
		}

		// Quality from path or query params
		let quality: "all" | "do" | "dont" = "all";
		const lastPart = pathParts[pathParts.length - 1];
		if (["do", "dont"].includes(lastPart)) {
			quality = lastPart as "do" | "dont";
		} else if (searchParams.get("quality")) {
			const queryQuality = searchParams.get("quality");
			if (queryQuality && ["do", "dont"].includes(queryQuality)) {
				quality = queryQuality as "do" | "dont";
			}
		}

		return { platform, category, pattern, quality };
	};

	const currentFilters = getCurrentFilters();

	const [filters, _setFilters] = useQueryStates({
		platform: parseAsStringEnum(["all", "web", "mobile"]).withDefault(
			currentFilters.platform,
		),
		quality: parseAsStringEnum(["all", "do", "dont"]).withDefault(
			currentFilters.quality,
		),
		category: parseAsString.withDefault(currentFilters.category),
		pattern: parseAsString.withDefault(currentFilters.pattern),
		search: parseAsString.withDefault(""),
		view: parseAsString.withDefault(""), // For modal state
	});

	return (
		<div
			className={cn(
				"sticky top-0 z-[1] bg-fd-card border-b border-fd-border py-4",
				className,
			)}
		>
			<div className="container-responsive">
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
					<div className="flex flex-wrap gap-3 items-center">
						{/* Platform Selection */}
						<fieldset className="flex items-center gap-1 bg-fd-muted rounded-lg p-1">
							<legend className="sr-only">Select platform to view</legend>
							<label className="cursor-pointer">
								<input
									type="radio"
									name="platform"
									value="all"
									checked={filters.platform === "all"}
									onChange={() => {
										router.push(ROUTES.HOME);
									}}
									className="sr-only"
								/>
								<div
									className={cn(
										"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
										"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
										filters.platform === "all"
											? "bg-fd-card text-fd-foreground shadow-sm"
											: "text-fd-muted-foreground hover:text-fd-foreground",
									)}
								>
									All
								</div>
							</label>

							<label className="cursor-pointer">
								<input
									type="radio"
									name="platform"
									value="web"
									checked={filters.platform === "web"}
									onChange={() => {
										router.push(ROUTES.WEB);
									}}
									className="sr-only"
								/>
								<div
									className={cn(
										"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
										"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
										filters.platform === "web"
											? "bg-fd-card text-fd-foreground shadow-sm"
											: "text-fd-muted-foreground hover:text-fd-foreground",
									)}
								>
									<Monitor className="w-4 h-4" />
									Web
								</div>
							</label>

							<label className="cursor-pointer">
								<input
									type="radio"
									name="platform"
									value="mobile"
									checked={filters.platform === "mobile"}
									onChange={() => {
										router.push(ROUTES.MOBILE);
									}}
									className="sr-only"
								/>
								<div
									className={cn(
										"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
										"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
										filters.platform === "mobile"
											? "bg-fd-card text-fd-foreground shadow-sm"
											: "text-fd-muted-foreground hover:text-fd-foreground",
									)}
								>
									<Smartphone className="w-4 h-4" />
									Mobile
								</div>
							</label>
						</fieldset>

						{/* Quality Selection - Always show */}
						<fieldset className="flex items-center gap-1 bg-fd-muted rounded-lg p-1">
							<legend className="sr-only">Select quality to view</legend>
							<label className="cursor-pointer">
								<input
									type="radio"
									name="quality"
									value="all"
									checked={filters.quality === "all"}
									onChange={() => {
										const platform = currentFilters.platform;
										const category = currentFilters.category;
										const pattern = currentFilters.pattern;

										if (pattern && category) {
											router.push(
												platform === "all"
													? ROUTES.pattern("web", category, pattern)
													: ROUTES.pattern(platform, category, pattern),
											);
										} else if (category) {
											router.push(
												platform === "all"
													? ROUTES.category("web", category)
													: ROUTES.category(platform, category),
											);
										} else {
											router.push(
												platform === "all"
													? ROUTES.HOME
													: ROUTES.platform(platform),
											);
										}
									}}
									className="sr-only"
								/>
								<div
									className={cn(
										"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
										"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
										filters.quality === "all"
											? "bg-fd-card text-fd-foreground shadow-sm"
											: "text-fd-muted-foreground hover:text-fd-foreground",
									)}
								>
									All
								</div>
							</label>

							<label className="cursor-pointer">
								<input
									type="radio"
									name="quality"
									value="do"
									checked={filters.quality === "do"}
									onChange={() => {
										const platform = currentFilters.platform;
										const category = currentFilters.category;
										const pattern = currentFilters.pattern;

										if (pattern && category) {
											router.push(
												platform === "all"
													? ROUTES.quality("web", category, pattern, "do")
													: ROUTES.quality(platform, category, pattern, "do"),
											);
										} else if (category) {
											router.push(
												platform === "all"
													? ROUTES.withQuality(
															ROUTES.category("web", category),
															"do",
														)
													: ROUTES.withQuality(
															ROUTES.category(platform, category),
															"do",
														),
											);
										} else {
											router.push(
												platform === "all"
													? ROUTES.withQuality(ROUTES.HOME, "do")
													: ROUTES.withQuality(ROUTES.platform(platform), "do"),
											);
										}
									}}
									className="sr-only"
								/>
								<div
									className={cn(
										"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
										"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
										filters.quality === "do"
											? "bg-fd-card text-fd-foreground shadow-sm"
											: "text-fd-muted-foreground hover:text-fd-foreground",
									)}
								>
									<CheckCircle className="w-4 h-4 text-green-600" />
									Do
								</div>
							</label>

							<label className="cursor-pointer">
								<input
									type="radio"
									name="quality"
									value="dont"
									checked={filters.quality === "dont"}
									onChange={() => {
										const platform = currentFilters.platform;
										const category = currentFilters.category;
										const pattern = currentFilters.pattern;

										if (pattern && category) {
											router.push(
												platform === "all"
													? ROUTES.quality("web", category, pattern, "dont")
													: ROUTES.quality(platform, category, pattern, "dont"),
											);
										} else if (category) {
											router.push(
												platform === "all"
													? ROUTES.withQuality(
															ROUTES.category("web", category),
															"dont",
														)
													: ROUTES.withQuality(
															ROUTES.category(platform, category),
															"dont",
														),
											);
										} else {
											router.push(
												platform === "all"
													? ROUTES.withQuality(ROUTES.HOME, "dont")
													: ROUTES.withQuality(
															ROUTES.platform(platform),
															"dont",
														),
											);
										}
									}}
									className="sr-only"
								/>
								<div
									className={cn(
										"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
										"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
										filters.quality === "dont"
											? "bg-fd-card text-fd-foreground shadow-sm"
											: "text-fd-muted-foreground hover:text-fd-foreground",
									)}
								>
									<XCircle className="w-4 h-4 text-red-600" />
									Don't
								</div>
							</label>
						</fieldset>

						{/* Category Select */}
						<FilterDropdown
							value={filters.category || ""}
							onValueChange={(value) => {
								const platform = currentFilters.platform;
								const quality = currentFilters.quality;

								if (value && value !== "all") {
									const basePlatform = platform === "all" ? "web" : platform;

									if (quality !== "all") {
										router.push(
											ROUTES.withQuality(
												ROUTES.category(basePlatform, value),
												quality,
											),
										);
									} else {
										router.push(ROUTES.category(basePlatform, value));
									}
								} else {
									// Clear category
									const pattern = currentFilters.pattern;
									if (pattern) {
										// Remove both category and pattern
										if (platform === "all") {
											router.push(
												quality !== "all"
													? ROUTES.withQuality(ROUTES.HOME, quality)
													: ROUTES.HOME,
											);
										} else {
											router.push(
												quality !== "all"
													? ROUTES.withQuality(
															ROUTES.platform(platform),
															quality,
														)
													: ROUTES.platform(platform),
											);
										}
									} else {
										// Just removing category
										if (platform === "all") {
											router.push(
												quality !== "all"
													? ROUTES.withQuality(ROUTES.HOME, quality)
													: ROUTES.HOME,
											);
										} else {
											router.push(
												quality !== "all"
													? ROUTES.withQuality(
															ROUTES.platform(platform),
															quality,
														)
													: ROUTES.platform(platform),
											);
										}
									}
								}
							}}
							placeholder="All Categories"
							label="Category"
							displayValue={
								filters.category
									? `Category: ${getPatternDisplayName(filters.category)}`
									: undefined
							}
							items={[
								{ value: "all", label: "All Categories" },
								...Object.keys(PATTERN_CATEGORIES).map((category) => ({
									value: category,
									label: getPatternDisplayName(category),
								})),
							]}
						/>

						{/* Pattern Select */}
						<FilterDropdown
							value={filters.pattern || ""}
							onValueChange={(value) => {
								const platform = currentFilters.platform;
								const quality = currentFilters.quality;
								const category = currentFilters.category;

								if (value && value !== "all") {
									const basePlatform = platform === "all" ? "web" : platform;

									// If category is selected, use it in the URL
									if (category) {
										if (quality !== "all") {
											router.push(
												ROUTES.quality(basePlatform, category, value, quality),
											);
										} else {
											router.push(
												ROUTES.pattern(basePlatform, category, value),
											);
										}
									} else {
										// If no category, try to find the category for this pattern
										const patternCategory = getCategoryForPattern(value);
										if (patternCategory) {
											if (quality !== "all") {
												router.push(
													ROUTES.quality(
														basePlatform,
														patternCategory,
														value,
														quality,
													),
												);
											} else {
												router.push(
													ROUTES.pattern(basePlatform, patternCategory, value),
												);
											}
										}
									}
								} else {
									// Clear pattern
									if (category) {
										router.push(
											quality !== "all"
												? ROUTES.withQuality(
														ROUTES.category(
															platform as "web" | "mobile",
															category,
														),
														quality,
													)
												: ROUTES.category(
														platform as "web" | "mobile",
														category,
													),
										);
									} else if (platform === "all") {
										router.push(
											quality !== "all"
												? ROUTES.withQuality(ROUTES.HOME, quality)
												: ROUTES.HOME,
										);
									} else {
										router.push(
											quality !== "all"
												? ROUTES.withQuality(ROUTES.platform(platform), quality)
												: ROUTES.platform(platform),
										);
									}
								}
							}}
							placeholder="All Patterns"
							label="Pattern"
							displayValue={
								filters.pattern
									? `Pattern: ${getPatternDisplayName(filters.pattern)}`
									: undefined
							}
							items={[
								{ value: "all", label: "All Patterns" },
								...(filters.category
									? PATTERN_CATEGORIES[
											filters.category as keyof typeof PATTERN_CATEGORIES
										] || []
									: Object.values(PATTERN_CATEGORIES).flat()
								).map((pattern) => ({
									value: pattern,
									label: getPatternDisplayName(pattern),
								})),
							]}
						/>
					</div>

					{/* Filter Button */}
					<button
						type="button"
						onClick={openSearch}
						className="flex items-center gap-2 px-3 py-1.5 bg-fd-card text-fd-foreground rounded-md text-sm font-medium shadow-sm hover:bg-fd-muted focus:outline-none focus:ring-2 focus:ring-fd-primary transition-all"
					>
						<Filter className="w-4 h-4" />
						Filter
					</button>
				</div>
			</div>
		</div>
	);
}
