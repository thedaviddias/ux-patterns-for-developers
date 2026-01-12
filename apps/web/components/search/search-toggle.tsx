"use client";

import { cn } from "@/lib/cn";
import { Search } from "lucide-react";
import { useState } from "react";
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

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className={cn(
					"inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
					className
				)}
				aria-label="Search documentation"
			>
				<Search className="h-4 w-4" />
				<span className="hidden sm:inline">Search...</span>
				<kbd className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-xs md:inline">
					⌘K
				</kbd>
			</button>
			<SearchDialog open={open} onOpenChange={setOpen} />
		</>
	);
}
