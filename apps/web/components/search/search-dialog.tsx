"use client";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@ux-patterns/ui/components/shadcn/command";
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "@ux-patterns/ui/components/shadcn/dialog";
import {
	Book,
	BookOpen,
	FileText,
	Loader2,
	Newspaper,
	Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlausible } from "next-plausible";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SearchResult } from "@/lib/search";
import { createQuickSearchData } from "@/lib/search";
import { trackSearchEvent } from "@/lib/tracking";

interface SearchDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

// Type icons
const typeIcons = {
	pattern: FileText,
	guide: Book,
	glossary: BookOpen,
	blog: Newspaper,
	page: FileText,
};

/**
 * Search Dialog Component
 *
 * Features:
 * - Quick client-side title search
 * - Full-text search via API
 * - Keyboard navigation (Cmd/Ctrl+K to open)
 * - Result grouping by type
 */
export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
	const router = useRouter();
	const plausible = usePlausible();
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const lastTrackedQuery = useRef<string>("");

	// Quick search data (titles only, for instant results)
	const quickSearchData = useMemo(() => createQuickSearchData(), []);

	// Quick filter for instant results
	const quickResults = useMemo(() => {
		if (!query || query.length < 2) return [];

		const lowerQuery = query.toLowerCase();
		return quickSearchData
			.filter((item) => item.title.toLowerCase().includes(lowerQuery))
			.slice(0, 5)
			.map((item) => ({
				...item,
				id: item.url,
				description: "",
				score: 1,
			}));
	}, [query, quickSearchData]);

	// Full-text search with debounce
	useEffect(() => {
		if (!query || query.length < 2) {
			setResults([]);
			return;
		}

		const timeout = setTimeout(async () => {
			setIsSearching(true);
			try {
				const searchUrl = `/api/search?q=${encodeURIComponent(query)}&limit=10`;
				const response = await fetch(searchUrl);
				const data = await response.json();
				const searchResults = data.results || [];
				setResults(searchResults);

				// Track search query (only if query changed to avoid duplicate events)
				if (query !== lastTrackedQuery.current) {
					lastTrackedQuery.current = query;
					trackSearchEvent(plausible, "query", {
						query,
						resultsCount: searchResults.length,
					});
				}
			} catch (error) {
				console.error("Search failed:", error);
			} finally {
				setIsSearching(false);
			}
		}, 300);

		return () => clearTimeout(timeout);
	}, [query, plausible]);

	// Combine quick results with full results
	const displayResults = useMemo(() => {
		if (results.length > 0) return results;
		return quickResults;
	}, [results, quickResults]);

	// Group results by type
	const groupedResults = useMemo(() => {
		const groups: Record<string, SearchResult[]> = {};
		for (const result of displayResults) {
			if (!groups[result.type]) {
				groups[result.type] = [];
			}
			groups[result.type].push(result);
		}
		return groups;
	}, [displayResults]);

	// Handle selection
	const handleSelect = useCallback(
		(result: SearchResult, position: number) => {
			trackSearchEvent(plausible, "result_click", {
				query,
				resultTitle: result.title,
				resultType: result.type,
				resultPosition: position,
				resultUrl: result.url,
			});
			router.push(result.url);
			onOpenChange(false);
			setQuery("");
		},
		[router, onOpenChange, plausible, query],
	);

	// Keyboard shortcut to open
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				onOpenChange(!open);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onOpenChange]);

	// Reset query when dialog closes
	useEffect(() => {
		if (!open) {
			setQuery("");
			setResults([]);
		}
	}, [open]);

	const typeLabels: Record<string, string> = {
		pattern: "Patterns",
		guide: "Guides",
		glossary: "Glossary",
		blog: "Blog",
		page: "Pages",
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="p-0 gap-0 max-w-2xl">
				<DialogTitle className="sr-only">Search documentation</DialogTitle>
				<Command shouldFilter={false} className="rounded-lg">
					<div className="flex items-center border-b px-3">
						<Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
						<CommandInput
							placeholder="Search documentation..."
							value={query}
							onValueChange={setQuery}
							className="border-0 focus:ring-0"
						/>
						{isSearching && (
							<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						)}
					</div>
					<CommandList className="max-h-[400px]">
						{query.length >= 2 &&
							displayResults.length === 0 &&
							!isSearching && <CommandEmpty>No results found.</CommandEmpty>}
						{Object.entries(groupedResults).map(([type, items]) => {
							const Icon =
								typeIcons[type as keyof typeof typeIcons] || FileText;
							return (
								<CommandGroup key={type} heading={typeLabels[type] || type}>
									{items.map((result, index) => (
										<CommandItem
											key={result.id}
											value={result.url}
											onSelect={() => handleSelect(result, index + 1)}
											className="cursor-pointer"
										>
											<Icon className="mr-2 h-4 w-4 text-muted-foreground" />
											<div className="flex flex-col flex-1 overflow-hidden">
												<span className="truncate font-medium">
													{result.title}
												</span>
												{result.description && (
													<span className="truncate text-sm text-muted-foreground">
														{result.description}
													</span>
												)}
											</div>
											<span className="ml-2 text-xs text-muted-foreground capitalize">
												{result.category}
											</span>
										</CommandItem>
									))}
								</CommandGroup>
							);
						})}
						{query.length < 2 && (
							<div className="p-4 text-center text-sm text-muted-foreground">
								Type at least 2 characters to search...
							</div>
						)}
					</CommandList>
					<div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
						<div className="flex gap-2">
							<kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">↑↓</kbd>
							<span>Navigate</span>
						</div>
						<div className="flex gap-2">
							<kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">↵</kbd>
							<span>Select</span>
						</div>
						<div className="flex gap-2">
							<kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">
								esc
							</kbd>
							<span>Close</span>
						</div>
					</div>
				</Command>
			</DialogContent>
		</Dialog>
	);
}
