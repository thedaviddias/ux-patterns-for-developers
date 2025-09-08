"use client";

import { SearchButton } from "@ux-patterns/ui/components/custom/search-button";
import { SearchModal } from "@ux-patterns/ui/components/custom/search-modal";
import { useState } from "react";
import type { Entry } from "@/lib/types";

interface HeaderSearchProps {
	entries: Entry[];
	patterns: string[];
}

export function HeaderSearch({ entries, patterns }: HeaderSearchProps) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const handleSearchClick = () => {
		setIsSearchOpen(true);
	};

	return (
		<>
			<SearchButton
				onClick={handleSearchClick}
				placeholder="Search patterns, websites, or keywords..."
			/>
			<SearchModal
				isOpen={isSearchOpen}
				onClose={() => setIsSearchOpen(false)}
				entries={entries}
				patterns={patterns}
			/>
		</>
	);
}
