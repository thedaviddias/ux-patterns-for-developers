"use client";

import { Search } from "lucide-react";

interface SearchButtonProps {
	onClick: () => void;
	className?: string;
	placeholder?: string;
}

export function SearchButton({
	onClick,
	placeholder = "Search patterns, websites, or keywords...",
}: SearchButtonProps) {
	return (
		<button
			type="button"
			data-search-full=""
			className="inline-flex items-center gap-2 border bg-fd-secondary/50 p-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground w-full my-auto max-md:hidden rounded-xl max-w-sm"
			onClick={onClick}
		>
			<Search className="h-4 w-4 shrink-0" />
			<span className="truncate">{placeholder}</span>
			<div className="ms-auto inline-flex gap-0.5">
				<kbd className="rounded-md border bg-fd-background px-1.5">⌘</kbd>
				<kbd className="rounded-md border bg-fd-background px-1.5">K</kbd>
			</div>
		</button>
	);
}
