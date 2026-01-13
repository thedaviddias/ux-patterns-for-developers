"use client";

import { PatternBadge } from "@ux-patterns/ui/components/custom/pattern-badge";
import { getBadgeType } from "@ux-patterns/ui/utils/pattern-status";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
							"group block p-4 rounded-lg border border-border",
							"bg-card hover:bg-secondary/50",
							"transition-all duration-200",
							"hover:shadow-sm dark:hover:shadow-none",
						)}
					>
						<div className="flex items-start justify-between">
							<div className="flex items-start gap-3 flex-1">
								{pattern.icon &&
									(() => {
										const IconComponent = getIconComponent(pattern.icon);
										return IconComponent ? (
											<IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5" />
										) : null;
									})()}
								<div className="flex-1">
									<div className="flex items-start gap-2">
										<h4 className="font-medium text-base text-card-foreground group-hover:text-primary mt-0">
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
							<ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2 transition-transform group-hover:translate-x-0.5" />
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};
