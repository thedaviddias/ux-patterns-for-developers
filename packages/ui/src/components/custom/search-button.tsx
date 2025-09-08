"use client";

import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

interface SearchButtonProps {
	onClick: () => void;
	className?: string;
	placeholder?: string;
}

export function SearchButton({
	onClick,
	className,
	placeholder = "Search patterns, websites, or keywords...",
}: SearchButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex h-10 w-full max-w-md items-center gap-3 rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm transition-colors",
				"hover:bg-accent hover:text-accent-foreground",
				"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
				className,
			)}
		>
			<Search className="h-4 w-4 shrink-0" />
			<span className="truncate">{placeholder}</span>
		</button>
	);
}
