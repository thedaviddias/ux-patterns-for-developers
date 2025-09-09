"use client";

import { useEffect } from "react";
import { useSearch } from "@/lib/search-context";

export function KeyboardShortcuts() {
	const { openSearch } = useSearch();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Check for Command+K (macOS) or Ctrl+K (Windows/Linux)
			if ((event.metaKey || event.ctrlKey) && event.key === "k") {
				event.preventDefault();
				openSearch();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [openSearch]);

	return null; // This component doesn't render anything
}
