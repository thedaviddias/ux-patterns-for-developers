"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterChipProps {
	label: string;
	onRemove: () => void;
	className?: string;
}

export function FilterChip({ label, onRemove, className }: FilterChipProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-2 px-3 py-1.5 bg-fd-foreground text-fd-background text-sm font-medium rounded-lg",
				className,
			)}
		>
			<span>{label}</span>
			<button
				onClick={onRemove}
				className="hover:bg-fd-background/20 rounded-full p-0.5 transition-colors"
				aria-label={`Remove ${label} filter`}
			>
				<X className="w-3 h-3" />
			</button>
		</div>
	);
}
