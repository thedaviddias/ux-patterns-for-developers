import { cn } from "@/lib/utils";

interface VerdictChipProps {
	type: "do" | "dont";
	className?: string;
	variant?: "default" | "overlay";
}

export function VerdictChip({
	type,
	className,
	variant = "default",
}: VerdictChipProps) {
	const isDo = type === "do";

	const getVariantStyles = () => {
		if (variant === "overlay") {
			return isDo
				? "bg-white/90 text-green-700 border-0 shadow-lg backdrop-blur-sm"
				: "bg-white/90 text-red-700 border-0 shadow-lg backdrop-blur-sm";
		}
		return isDo
			? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30"
			: "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30";
	};

	return (
		<span
			className={cn(
				"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
				getVariantStyles(),
				className,
			)}
		>
			<span className="mr-1" aria-hidden="true">
				{isDo ? "✅" : "❌"}
			</span>
			{isDo ? "Do" : "Don't"}
		</span>
	);
}
