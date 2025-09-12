"use client";

import { LargeSearchToggleBtn } from "@ux-patterns/ui/components/custom/search-button";
import { SearchModal } from "@ux-patterns/ui/components/custom/search-modal";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";
import { useSearch } from "@/lib/search-context";
import { trackGallerySearch } from "@/lib/tracking";
import type { Entry } from "@/lib/types";

interface HeaderSearchWrapperProps {
	entries: Entry[];
	patterns: string[];
}

export function HeaderSearchWrapper({
	entries,
	patterns,
}: HeaderSearchWrapperProps) {
	const { isSearchOpen, openSearch, closeSearch } = useSearch();
	const plausible = usePlausible();

	const handleSearchClick = () => {
		trackGallerySearch(plausible, "open");
		openSearch();
	};

	return (
		<>
			<LargeSearchToggleBtn
				onClick={handleSearchClick}
				placeholder="Search..."
			/>
			<SearchModal
				isOpen={isSearchOpen}
				onClose={closeSearch}
				entries={entries}
				patterns={patterns}
			/>
		</>
	);
}

// Client component that uses SearchProvider context
export function HeaderSearchDialog() {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [patterns, setPatterns] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { isSearchOpen, openSearch, closeSearch } = useSearch();
	const plausible = usePlausible();

	useEffect(() => {
		// Load data on the client side
		const loadData = async () => {
			try {
				const response = await fetch("/api/search-data");
				if (response.ok) {
					const data = await response.json();
					setEntries(data.entries);
					setPatterns(data.patterns);
				}
			} catch (error) {
				console.error("Failed to load search data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	const _handleSearchClick = () => {
		trackGallerySearch(plausible, "open");
		openSearch();
	};

	if (isLoading) {
		return null; // Don't render anything while loading
	}

	return (
		<SearchModal
			isOpen={isSearchOpen}
			onClose={closeSearch}
			entries={entries}
			patterns={patterns}
		/>
	);
}
