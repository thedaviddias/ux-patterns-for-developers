import Image from "next/image";
import { getImagePath } from "@/lib/image-utils";
import type { Entry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { VerdictChip } from "./verdict-chip";

interface ImageWithVerdictProps {
	src?: string;
	alt: string;
	type: "do" | "dont";
	className?: string;
	entry?: Entry;
}

export function ImageWithVerdict({
	src,
	alt,
	type,
	className,
	entry,
}: ImageWithVerdictProps) {
	const isDo = type === "do";
	// Use getImagePath if entry is provided, otherwise use src directly
	const imageSrc = entry ? getImagePath(entry) : src!;

	return (
		<div className={cn("relative", className)}>
			{/* Image with border */}
			<div
				className={cn(
					"relative aspect-[4/3] bg-fd-background rounded-xl overflow-hidden",
					isDo
						? "border-2 border-green-500"
						: "border-2 border-red-500 border-dashed",
				)}
			>
				<Image
					src={imageSrc}
					alt={alt}
					fill
					className="object-contain"
					sizes="(max-width: 1024px) 100vw, 896px"
					priority
				/>

				{/* Verdict chip overlay */}
				<div className="absolute top-3 right-3">
					<VerdictChip type={type} variant="overlay" />
				</div>
			</div>
		</div>
	);
}
