"use client";

import {
	Folder,
	Globe,
	Monitor,
	Search,
	Smartphone,
	TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Define Entry type locally to avoid import issues
interface Entry {
	id: string;
	title: string;
	website: string;
	pattern: string;
	platform: "web" | "mobile";
	type: "do" | "dont";
	media: {
		type: "image" | "video";
		src: string;
	};
	tags?: string[];
	content: string;
	slug: string;
}

import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogTitle } from "../shadcn/dialog";

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
	entries: Entry[];
	patterns: string[];
}

type SearchView = "browse" | "search";

export function SearchModal({
	isOpen,
	onClose,
	entries,
	patterns,
}: SearchModalProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeView, setActiveView] = useState<SearchView>("browse");
	const [selectedCategory, setSelectedCategory] = useState("trending");
	const [selectedPlatform, setSelectedPlatform] = useState<
		"all" | "web" | "mobile"
	>("all");

	// Reset state when modal opens/closes
	useEffect(() => {
		if (isOpen) {
			setSearchQuery("");
			setActiveView("browse");
			setSelectedCategory("trending");
			setSelectedPlatform("all");
		}
	}, [isOpen]);

	// Switch to search view when typing
	useEffect(() => {
		if (searchQuery.trim()) {
			setActiveView("search");
		} else {
			setActiveView("browse");
		}
	}, [searchQuery]);

	// Generate dynamic categories from actual data
	const dynamicCategories = useMemo(() => {
		const uniquePatterns = [...new Set(entries.map((entry) => entry.pattern))];
		const uniqueWebsites = [...new Set(entries.map((entry) => entry.website))];

		return [
			{
				id: "trending",
				label: "Trending",
				icon: TrendingUp,
				count: entries.length,
			},
			{
				id: "patterns",
				label: "Patterns",
				icon: Folder,
				count: uniquePatterns.length,
			},
			{
				id: "websites",
				label: "Websites",
				icon: Globe,
				count: uniqueWebsites.length,
			},
		];
	}, [entries]);

	// Filter entries based on platform and search query
	const filteredEntries = useMemo(() => {
		let filtered = entries;

		// Filter by platform
		if (selectedPlatform !== "all") {
			filtered = filtered.filter(
				(entry) => entry.platform === selectedPlatform,
			);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(entry) =>
					entry.title.toLowerCase().includes(query) ||
					entry.website.toLowerCase().includes(query) ||
					entry.pattern.toLowerCase().includes(query) ||
					entry.content.toLowerCase().includes(query),
			);
		}

		return filtered;
	}, [entries, selectedPlatform, searchQuery]);

	const _handleEntryClick = (entry: Entry) => {
		onClose();
		// Open entry modal using URL query parameter
		const url = new URL(window.location.href);
		url.searchParams.set("view", entry.id);
		window.history.pushState({}, "", url.toString());
		// Trigger a custom event to notify the gallery client
		window.dispatchEvent(
			new CustomEvent("entryModalOpen", { detail: { entryId: entry.id } }),
		);
	};

	// Helper function to get category for a pattern
	const getCategoryForPattern = (pattern: string): string | null => {
		const PATTERN_CATEGORIES: Record<string, string[]> = {
			forms: [
				"button",
				"text-field",
				"checkbox",
				"radio-button",
				"select",
				"toggle",
				"slider",
				"date-picker",
				"file-upload",
				"validation",
			],
			navigation: [
				"navbar",
				"sidebar",
				"tab-bar",
				"breadcrumb",
				"pagination",
				"stepper",
				"menu",
				"back-button",
				"load-more",
				"back-to-top",
			],
			"data-display": [
				"table",
				"list",
				"card",
				"accordion",
				"carousel",
				"timeline",
				"stats",
				"chart",
				"badge",
				"tag",
			],
			feedback: [
				"alert",
				"toast",
				"modal",
				"popover",
				"tooltip",
				"progress",
				"loading",
				"empty-state",
				"error-state",
				"success-state",
			],
			input: [
				"search",
				"autocomplete",
				"otp",
				"pin-input",
				"rich-text-editor",
				"code-editor",
				"color-picker",
				"rating",
				"emoji-picker",
				"mention",
			],
			layout: [
				"grid",
				"masonry",
				"split-view",
				"kanban",
				"tree-view",
				"gantt",
				"calendar",
				"scheduler",
				"dashboard",
				"workspace",
			],
			commerce: [
				"product-card",
				"cart",
				"checkout",
				"payment",
				"pricing",
				"product-gallery",
				"wishlist",
				"reviews",
				"filters",
				"comparison",
			],
			social: [
				"comment",
				"like",
				"share",
				"follow",
				"profile",
				"feed",
				"story",
				"message",
				"notification",
				"activity",
				"avatar",
				"presence",
			],
			media: [
				"image-gallery",
				"video-player",
				"audio-player",
				"document-viewer",
				"map",
				"ar-viewer",
				"360-viewer",
				"zoom",
				"lightbox",
				"slideshow",
			],
			utility: [
				"copy",
				"download",
				"print",
				"share",
				"export",
				"import",
				"settings",
				"help",
				"feedback",
				"language-selector",
				"theme-toggle",
			],
		};

		const normalizedPattern = pattern.toLowerCase().replace(/\s+/g, "-");

		for (const [category, patterns] of Object.entries(PATTERN_CATEGORIES)) {
			if (patterns.includes(normalizedPattern)) {
				return category;
			}
		}

		return null;
	};

	const getPatternUrl = (
		pattern: string,
		platform: "web" | "mobile" | "all" = "web",
	) => {
		const urlPattern = pattern.toLowerCase().replace(/\s+/g, "-");
		const category = getCategoryForPattern(urlPattern);

		if (category) {
			const actualPlatform = platform === "all" ? "web" : platform;
			return `/${actualPlatform}/${category}/${urlPattern}`;
		}

		// Fallback to search if category not found
		return `/search?pattern=${encodeURIComponent(urlPattern)}`;
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl w-[85vw] h-[70vh] p-0 overflow-hidden bg-fd-card">
				<DialogTitle className="sr-only">Search UX Patterns</DialogTitle>

				{/* Main Content Area */}
				<div className="flex-1 flex flex-col h-full">
					{/* Search Bar */}
					<div className="p-6 border-b border-fd-border">
						<div className="relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fd-muted-foreground" />
							<input
								type="text"
								placeholder="Search patterns, examples, websites, or keywords..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-12 pr-20 py-4 bg-fd-muted border border-fd-border rounded-lg text-lg text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary focus:border-transparent"
								autoFocus
							/>
							{/* Platform Filter */}
							<div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
								<button
									type="button"
									onClick={() => setSelectedPlatform("all")}
									className={cn(
										"p-2 hover:bg-fd-muted rounded transition-colors",
										selectedPlatform === "all" &&
											"bg-fd-primary text-fd-primary-foreground",
									)}
									title="All platforms"
								>
									<Globe className="w-4 h-4" />
								</button>
								<button
									type="button"
									onClick={() => setSelectedPlatform("web")}
									className={cn(
										"p-2 hover:bg-fd-muted rounded transition-colors",
										selectedPlatform === "web" &&
											"bg-fd-primary text-fd-primary-foreground",
									)}
									title="Web only"
								>
									<Monitor className="w-4 h-4" />
								</button>
								<button
									type="button"
									onClick={() => setSelectedPlatform("mobile")}
									className={cn(
										"p-2 hover:bg-fd-muted rounded transition-colors",
										selectedPlatform === "mobile" &&
											"bg-fd-primary text-fd-primary-foreground",
									)}
									title="Mobile only"
								>
									<Smartphone className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>

					{/* Content Area */}
					<div className="flex-1 overflow-auto">
						<div className="flex h-full">
							{/* Left Sidebar - Only show in browse mode */}
							{activeView === "browse" && (
								<div className="w-80 border-r border-fd-border bg-fd-card/50 p-6">
									<div className="space-y-3">
										{dynamicCategories.map((category) => {
											const Icon = category.icon;
											return (
												<button
													type="button"
													key={category.id}
													onClick={() => setSelectedCategory(category.id)}
													className={cn(
														"w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors",
														selectedCategory === category.id
															? "bg-fd-primary text-fd-primary-foreground"
															: "hover:bg-fd-muted text-fd-foreground",
													)}
												>
													<div className="flex items-center gap-3">
														<Icon className="w-5 h-5" />
														<span className="font-medium">
															{category.label}
														</span>
													</div>
													<span className="text-sm opacity-70">
														{category.count}
													</span>
												</button>
											);
										})}
									</div>
								</div>
							)}
							{activeView === "browse" ? (
								<BrowseView
									selectedCategory={selectedCategory}
									selectedPlatform={selectedPlatform}
									entries={filteredEntries}
									patterns={patterns}
									getPatternUrl={getPatternUrl}
									onClose={onClose}
								/>
							) : (
								<SearchView
									searchQuery={searchQuery}
									selectedPlatform={selectedPlatform}
									entries={filteredEntries}
									patterns={patterns}
									getPatternUrl={getPatternUrl}
									onClose={onClose}
								/>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function BrowseView({
	selectedCategory,
	selectedPlatform,
	entries,
	patterns: _patterns,
	getPatternUrl,
	onClose,
}: {
	selectedCategory: string;
	selectedPlatform: "web" | "mobile" | "all";
	entries: Entry[];
	patterns: string[];
	getPatternUrl: (
		pattern: string,
		platform?: "web" | "mobile" | "all",
	) => string;
	onClose: () => void;
}) {
	// Get unique patterns with counts
	const patternsWithCounts = useMemo(() => {
		const patternCounts = entries.reduce(
			(acc, entry) => {
				acc[entry.pattern] = (acc[entry.pattern] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(patternCounts)
			.map(([pattern, count]) => ({ pattern, count }))
			.sort((a, b) => b.count - a.count);
	}, [entries]);

	// Get unique websites with counts
	const websitesWithCounts = useMemo(() => {
		const websiteCounts = entries.reduce(
			(acc, entry) => {
				acc[entry.website] = (acc[entry.website] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(websiteCounts)
			.map(([website, count]) => ({ website, count }))
			.sort((a, b) => b.count - a.count);
	}, [entries]);

	// Get recent entries for trending
	const recentEntries = useMemo(() => {
		return entries
			.sort((a, b) => {
				// Sort by pattern name for consistency since we don't have dates
				return a.pattern.localeCompare(b.pattern);
			})
			.slice(0, 12);
	}, [entries]);

	switch (selectedCategory) {
		case "trending":
			return (
				<div className="p-6">
					<div className="space-y-6">
						{/* Recent Entries */}
						<div>
							<h3 className="text-lg font-semibold text-fd-foreground mb-4">
								Recent Patterns
							</h3>
							<div className="grid grid-cols-2 gap-4">
								{recentEntries.map((entry) => {
									const entryUrl = getPatternUrl(
										entry.pattern,
										entry.platform as "web" | "mobile",
									);
									return (
										<a
											key={entry.id}
											href={entryUrl}
											onClick={onClose}
											className="block p-4 hover:bg-fd-muted rounded-lg transition-colors border border-fd-border"
										>
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-fd-muted rounded-lg flex items-center justify-center">
													<span className="text-sm font-bold">
														{entry.website.charAt(0).toUpperCase()}
													</span>
												</div>
												<div className="flex-1 min-w-0">
													<div className="font-medium text-fd-foreground truncate">
														{entry.title}
													</div>
													<div className="text-sm text-fd-muted-foreground">
														{entry.pattern} • {entry.website}
													</div>
												</div>
												<div
													className={cn(
														"px-2 py-1 rounded-full text-xs font-medium",
														entry.type === "do"
															? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
															: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
													)}
												>
													{entry.type}
												</div>
											</div>
										</a>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			);

		case "patterns":
			return (
				<div className="p-6">
					<div className="space-y-2">
						{patternsWithCounts.map(({ pattern, count }) => {
							const patternUrl = getPatternUrl(pattern, selectedPlatform);
							return (
								<a
									key={pattern}
									href={patternUrl}
									onClick={onClose}
									className="block w-full p-3 hover:bg-fd-muted rounded-lg transition-colors"
								>
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 bg-fd-muted rounded-lg flex items-center justify-center">
											<Folder className="w-4 h-4 text-fd-foreground" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="font-medium text-fd-foreground">
												{pattern}
											</div>
											<div className="text-sm text-fd-muted-foreground">
												{count} example{count !== 1 ? "s" : ""}
											</div>
										</div>
									</div>
								</a>
							);
						})}
					</div>
				</div>
			);

		case "websites":
			return (
				<div className="p-6">
					<div className="space-y-3">
						{websitesWithCounts.map(({ website, count }) => {
							const websiteUrl = `/website/${website.toLowerCase().replace(/\s+/g, "-")}`;
							return (
								<a
									key={website}
									href={websiteUrl}
									onClick={onClose}
									className="block w-full p-4 hover:bg-fd-muted rounded-lg transition-colors border border-fd-border"
								>
									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium text-fd-foreground">
												{website}
											</div>
											<div className="text-sm text-fd-muted-foreground">
												{count} pattern{count !== 1 ? "s" : ""}
											</div>
										</div>
										<div className="text-2xl font-bold text-fd-muted-foreground">
											{count}
										</div>
									</div>
								</a>
							);
						})}
					</div>
				</div>
			);

		default:
			return (
				<div className="flex items-center justify-center h-full text-fd-muted-foreground">
					Select a category to browse
				</div>
			);
	}
}

function SearchView({
	searchQuery,
	selectedPlatform,
	entries,
	patterns,
	getPatternUrl,
	onClose,
}: {
	searchQuery: string;
	selectedPlatform: "web" | "mobile" | "all";
	entries: Entry[];
	patterns: string[];
	getPatternUrl: (
		pattern: string,
		platform?: "web" | "mobile" | "all",
	) => string;
	onClose: () => void;
}) {
	// Remove unused matchingPatterns since we're not displaying a separate patterns section
	// Group entries by pattern for better organization
	const entriesByPattern = useMemo(() => {
		const grouped = entries.reduce(
			(acc, entry) => {
				if (!acc[entry.pattern]) {
					acc[entry.pattern] = [];
				}
				acc[entry.pattern].push(entry);
				return acc;
			},
			{} as Record<string, Entry[]>,
		);

		return Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
	}, [entries]);

	return (
		<div className="p-6">
			<div className="space-y-6">
				{/* Search Results Header */}
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-fd-foreground">
						Search Results for "{searchQuery}"
					</h2>
					<div className="text-sm text-fd-muted-foreground">
						{entries.length} result{entries.length !== 1 ? "s" : ""} found
					</div>
				</div>

				{/* Entries by Pattern */}
				{entriesByPattern.length > 0 && (
					<div className="space-y-4">
						{entriesByPattern.map(([pattern, patternEntries]) => (
							<div key={pattern}>
								<div className="flex items-center gap-3 mb-3">
									<h3 className="text-base font-medium text-fd-foreground">
										{pattern}
									</h3>
									<span className="text-sm text-fd-muted-foreground">
										{patternEntries.length} example
										{patternEntries.length !== 1 ? "s" : ""}
									</span>
								</div>
								<div className="grid grid-cols-1 gap-3">
									{patternEntries.map((entry) => {
										const entryUrl = `${getPatternUrl(entry.pattern, entry.platform as "web" | "mobile")}/${entry.type}`;
										return (
											<a
												key={entry.id}
												href={entryUrl}
												onClick={onClose}
												className="block p-4 hover:bg-fd-muted rounded-lg transition-colors border border-fd-border"
											>
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-fd-muted rounded-lg flex items-center justify-center">
														<span className="text-sm font-bold">
															{entry.website.charAt(0).toUpperCase()}
														</span>
													</div>
													<div className="flex-1 min-w-0">
														<div className="font-medium text-fd-foreground">
															{entry.title}
														</div>
														<div className="text-sm text-fd-muted-foreground">
															{entry.website} • {entry.pattern}
														</div>
													</div>
													<div
														className={cn(
															"px-3 py-1 rounded-full text-sm font-medium",
															entry.type === "do"
																? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
																: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
														)}
													>
														{entry.type}
													</div>
												</div>
											</a>
										);
									})}
								</div>
							</div>
						))}
					</div>
				)}

				{/* No Results */}
				{entries.length === 0 && (
					<div className="text-center py-12">
						<div className="text-fd-muted-foreground mb-4">
							No results found for "{searchQuery}"
						</div>
						<div className="text-sm text-fd-muted-foreground mb-4">
							Try searching for patterns, websites, or tags
						</div>
						<a
							href="/request"
							onClick={onClose}
							className="text-fd-primary hover:underline"
						>
							Request pattern
						</a>
					</div>
				)}
			</div>
		</div>
	);
}
