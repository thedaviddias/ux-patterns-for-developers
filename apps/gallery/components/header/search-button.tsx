"use client";

import { LargeSearchToggleBtn } from "@ux-patterns/ui/components/custom/search-button";
import { usePlausible } from "next-plausible";
import { useSearch } from "@/lib/search-context";
import { trackGallerySearch } from "@/lib/tracking";

export function SearchButton() {
	const { openSearch } = useSearch();
	const plausible = usePlausible();

	const handleSearchClick = () => {
		trackGallerySearch(plausible, "open");
		openSearch();
	};

	return (
		<LargeSearchToggleBtn onClick={handleSearchClick} placeholder="Search..." />
	);
}
