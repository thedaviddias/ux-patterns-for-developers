import { Badge } from "@ux-patterns/ui/components/shadcn/badge";
import { Gauge, Rocket, Zap } from "lucide-react";
import { cn } from "@/lib/cn";

type BuildEffortProps = {
	level: "low" | "medium" | "high";
	description: string;
};

export const BuildEffort = ({ level, description }: BuildEffortProps) => {
	const effortConfig = {
		low: {
			label: "Low Complexity",
			icon: Zap,
			bgGradient:
				"from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
			borderColor: "border-blue-200 dark:border-blue-800",
			iconColor: "text-blue-500 dark:text-blue-400",
			badgeClass:
				"bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-700",
			progressWidth: "w-1/3",
		},
		medium: {
			label: "Medium Complexity",
			icon: Gauge,
			bgGradient:
				"from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
			borderColor: "border-amber-200 dark:border-amber-800",
			iconColor: "text-amber-500 dark:text-amber-400",
			badgeClass:
				"bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-700",
			progressWidth: "w-2/3",
		},
		high: {
			label: "High Complexity",
			icon: Rocket,
			bgGradient:
				"from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30",
			borderColor: "border-rose-200 dark:border-rose-800",
			iconColor: "text-rose-500 dark:text-rose-400",
			badgeClass:
				"bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-700",
			progressWidth: "w-full",
		},
	}[level];

	const Icon = effortConfig.icon;

	return (
		<div
			className={cn(
				"relative mt-8 mb-8 rounded-xl overflow-hidden",
				"border",
				effortConfig.borderColor,
				"bg-gradient-to-br",
				effortConfig.bgGradient,
			)}
		>
			{/* Decorative pattern */}
			<div className="absolute inset-0 opacity-5">
				<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern
							id="build-pattern"
							x="0"
							y="0"
							width="20"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<rect x="0" y="0" width="1" height="20" fill="currentColor" />
							<rect x="0" y="0" width="20" height="1" fill="currentColor" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#build-pattern)" />
				</svg>
			</div>

			<div className="relative px-4 py-3">
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"flex h-10 w-10 items-center justify-center rounded-md",
							"bg-white/60 dark:bg-black/20 backdrop-blur-sm",
							"border border-white/50 dark:border-white/10",
						)}
					>
						<Icon className={cn("h-5 w-5", effortConfig.iconColor)} />
					</div>

					<div className="flex-1">
						<div className="flex items-center justify-between gap-4">
							<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Build Effort
							</span>
							<Badge
								variant="outline"
								className={cn("text-xs", effortConfig.badgeClass)}
							>
								{effortConfig.label}
							</Badge>
						</div>

						<p className="text-sm text-muted-foreground leading-relaxed mt-1 mb-0">
							{description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
