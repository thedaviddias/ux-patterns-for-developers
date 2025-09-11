"use client";

import { SearchButton } from "@ux-patterns/ui/components/custom/search-button";
import { SearchModal } from "@ux-patterns/ui/components/custom/search-modal";
import { usePlausible } from "next-plausible";
import { useSearch } from "@/lib/search-context";
import { trackGallerySearch } from "@/lib/tracking";
import type { Entry } from "@/lib/types";

interface HeaderSearchProps {
	entries: Entry[];
	patterns: string[];
}

export function HeaderSearch({ entries, patterns }: HeaderSearchProps) {
	const { isSearchOpen, openSearch, closeSearch } = useSearch();
	const plausible = usePlausible();

	const handleSearchClick = () => {
		trackGallerySearch(plausible, "open");
		openSearch();
	};

	return (
		<>
			<SearchButton
				onClick={handleSearchClick}
				placeholder="Search patterns, examples, websites, or keywords..."
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
