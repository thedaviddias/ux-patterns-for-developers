import { Badge } from "@ux-patterns/ui/components/shadcn/badge";
import { cn } from "@/lib/cn";

type PatternStatsProps = {
	popularity?: "low" | "medium" | "high" | "trending";
	className?: string;
	mode?: "hidden" | "inline" | "block";
};

const popularityConfig = {
	low: {
		label: "Growing",
		icon: "📈",
		className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
	},
	medium: {
		label: "Popular",
		icon: "⭐",
		className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
	},
	high: {
		label: "Very Popular",
		icon: "🌟",
		className:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
	},
	trending: {
		label: "Trending",
		icon: "🔥",
		className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
	},
};

/**
 * Renders the (frontmatter-driven) popularity badge for a pattern. View counts
 * were removed: they relied on a per-request /api/stats call that added function
 * load without adding value.
 */
export const PatternStats = ({
	popularity,
	className,
	mode = "hidden",
}: PatternStatsProps) => {
	if (mode === "hidden" || !popularity) return null;

	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400",
				mode === "block" && "mb-4",
				className,
			)}
		>
			<Badge
				className={cn(
					"px-2 py-0.5 text-xs font-medium",
					popularityConfig[popularity].className,
				)}
			>
				<span className="mr-1">{popularityConfig[popularity].icon}</span>
				{popularityConfig[popularity].label}
			</Badge>
		</div>
	);
};
