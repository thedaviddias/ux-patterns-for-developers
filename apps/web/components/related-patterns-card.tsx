"use client";

import { PatternBadge } from "@ux-patterns/ui/components/custom/pattern-badge";
import { getBadgeType } from "@ux-patterns/ui/utils/pattern-status";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cardHoverClassName } from "../lib/card-interactions";
import { cn } from "../lib/cn";
import type { EnrichedPattern } from "../utils/enrich-patterns-with-icons";

// Type-safe icon access
function getIconComponent(iconName: string): LucideIcon | undefined {
	return (Icons as unknown as Record<string, LucideIcon>)[iconName];
}

type RelatedPattern = EnrichedPattern;

type RelatedPatternsCardProps = {
	patterns?: RelatedPattern[];
	category?: string;
	maxItems?: number;
	className?: string;
};

export const RelatedPatternsCard = ({
	patterns,
	maxItems = 4,
	className,
}: RelatedPatternsCardProps) => {
	const pathname = usePathname();
	const slug =
		pathname.replace(/\/$/, "").split("/").filter(Boolean).pop() || "";

	// Use provided patterns (enriched with icons from server)
	let displayPatterns = patterns;

	// Filter out current pattern and limit items
	displayPatterns = displayPatterns
		?.filter((p) => {
			if (!slug) return true;
			const targetSlug =
				p.path.replace(/\/$/, "").split("/").filter(Boolean).pop() || "";
			return targetSlug !== slug;
		})
		.slice(0, maxItems);

	if (!displayPatterns || displayPatterns.length === 0) return null;

	return (
		<div className={cn("mt-6", className)}>
			<div className="grid gap-3 sm:grid-cols-2">
				{displayPatterns.map((pattern) => (
					<Link
						key={pattern.path}
						href={pattern.path}
						data-card
						className={cn(
							"group block rounded-[1.5rem] border border-border/60 bg-background/75 p-4",
							cardHoverClassName(),
						)}
					>
						<div className="flex items-start justify-between">
							<div className="flex items-start gap-3 flex-1">
								{pattern.icon &&
									(() => {
										const IconComponent = getIconComponent(pattern.icon);
										return IconComponent ? (
											<IconComponent className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
										) : null;
									})()}
								<div className="flex-1">
									<div className="flex items-start gap-2">
										<h4 className="mt-0 text-base font-medium text-card-foreground">
											{pattern.title}
										</h4>
										{(() => {
											// Extract slug from pattern path
											const slug = pattern.path
												.replace(/^\/patterns\//, "")
												.replace(/\/$/, "");

											// Try to get git dates (this will work at build time)
											let gitDates = null;
											if (typeof window === "undefined") {
												// Server-side only
												try {
													const {
														getPatternDatesBySlug,
													} = require("../lib/pattern-dates");
													gitDates = getPatternDatesBySlug(slug);
												} catch {}
											}

											const badgeType = getBadgeType({
												status: (pattern as any).status || "complete",
												gitCreatedAt: gitDates?.created,
												gitUpdatedAt: gitDates?.updated,
												isMajorUpdate: gitDates?.isMajorUpdate,
												createdAt: (pattern as any).createdAt,
												updatedAt: (pattern as any).updatedAt,
												publishedAt: (pattern as any).publishedAt,
												lastMajorUpdate: (pattern as any).lastMajorUpdate,
											});
											return badgeType ? (
												<PatternBadge
													variant={badgeType}
													className="flex-shrink-0"
												/>
											) : null;
										})()}
									</div>
									{pattern.description && (
										<p className="text-sm text-muted-foreground mt-1 mb-0">
											{pattern.description}
										</p>
									)}
								</div>
							</div>
							<ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};
