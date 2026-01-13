"use client";

import { Search } from "lucide-react";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { trackSearchEvent } from "@/lib/tracking";
import { SearchDialog } from "./search-dialog";

interface SearchToggleProps {
	className?: string;
}

/**
 * Search Toggle Button
 *
 * Displays a search button that opens the search dialog.
 * Shows keyboard shortcut hint on desktop.
 */
export function SearchToggle({ className }: SearchToggleProps) {
	const [open, setOpen] = useState(false);
	const [isMac, setIsMac] = useState(true); // Default to Mac for SSR
	const plausible = usePlausible();

	// Detect platform on mount
	useEffect(() => {
		setIsMac(navigator.platform?.toLowerCase().includes("mac") ?? true);
	}, []);

	const handleOpen = () => {
		setOpen(true);
		trackSearchEvent(plausible, "open");
	};

	return (
		<>
			<button
				type="button"
				onClick={handleOpen}
				className={cn(
					"inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
					className,
				)}
				aria-label="Search documentation"
			>
				<Search className="h-4 w-4" />
				<span className="hidden sm:inline">Search...</span>
				<kbd className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-xs md:inline">
					{isMac ? "⌘K" : "Ctrl+K"}
				</kbd>
			</button>
			<SearchDialog open={open} onOpenChange={setOpen} />
		</>
	);
}
