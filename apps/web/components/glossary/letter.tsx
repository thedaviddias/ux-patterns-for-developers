"use client";

import { cn } from "@/lib/cn";

interface LetterProps {
	letter: string;
	hasContent?: boolean;
}

export function Letter({ letter, hasContent = true }: LetterProps) {
	if (!hasContent) {
		return (
			<span
				className={cn(
					"px-3 py-2 rounded-md text-sm font-medium",
					"text-fd-muted-foreground/50 cursor-not-allowed",
				)}
			>
				{letter}
			</span>
		);
	}

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		const element = document.getElementById(letter.toLowerCase());
		if (element) {
			element.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	};

	return (
		<button
			onClick={handleClick}
			className={cn(
				"px-3 py-2 rounded-md text-sm font-medium transition-colors",
				"text-fd-foreground hover:bg-fd-accent hover:text-fd-accent-foreground",
			)}
		>
			{letter}
		</button>
	);
}
