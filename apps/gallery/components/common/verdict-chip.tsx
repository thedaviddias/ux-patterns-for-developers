import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerdictChipProps {
	type: "do" | "dont";
	className?: string;
	variant?: "default" | "overlay" | "prominent";
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
		if (variant === "prominent") {
			return isDo
				? "bg-green-600 text-white border-2 border-green-700 shadow-md"
				: "bg-red-600 text-white border-2 border-red-700 shadow-md";
		}
		return isDo
			? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30"
			: "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30";
	};

	const getSizeStyles = () => {
		if (variant === "prominent") {
			return "px-4 py-2 text-base";
		}
		return "px-2 py-1 text-sm";
	};

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full font-medium",
				getSizeStyles(),
				getVariantStyles(),
				className,
			)}
		>
			<span className="mr-1.5" aria-hidden="true">
				{isDo ? (
					<Check className={variant === "prominent" ? "w-5 h-5" : "w-4 h-4"} />
				) : (
					<X className={variant === "prominent" ? "w-5 h-5" : "w-4 h-4"} />
				)}
			</span>
			<span className={variant === "prominent" ? "font-bold" : ""}>
				{isDo ? "Do This" : "Don't Do This"}
			</span>
		</span>
	);
}
