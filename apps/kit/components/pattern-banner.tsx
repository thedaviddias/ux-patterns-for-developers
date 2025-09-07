"use client";

import { cn } from "@ux-patterns/ui/lib/utils";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePlausible } from "next-plausible";

type PatternBannerProps = {
	patternName: string;
	patternUrl: string;
	className?: string;
};

export const PatternBanner = ({
	patternName,
	patternUrl,
	className,
}: PatternBannerProps) => {
	const plausible = usePlausible();

	return (
		<Link
			href={patternUrl}
			target="_blank"
			rel="noopener"
			className={cn(
				"not-prose group relative mb-8 flex items-center justify-between rounded-lg",
				"border border-border/50 bg-gradient-to-r from-muted/30 to-muted/10",
				"px-4 py-3 transition-all duration-200",
				"hover:border-primary/20 hover:from-muted/50 hover:to-muted/20",
				"hover:shadow-sm",
				className,
			)}
			onClick={() => {
				plausible("Pattern Guide Click", {
					props: {
						pattern_name: patternName,
						pattern_url: patternUrl,
					},
				});
			}}
		>
			<div className="flex items-center gap-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
					<BookOpen className="h-4 w-4 text-primary" />
				</div>
				<div className="flex flex-col">
					<span className="text-xs text-muted-foreground">
						UX Pattern Guide
					</span>
					<span className="text-sm font-medium">
						Learn {patternName} best practices
					</span>
				</div>
			</div>
			<ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
		</Link>
	);
};
