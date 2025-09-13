"use client";

import { cn } from "@ux-patterns/ui/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePlausible } from "next-plausible";

type GalleryBannerProps = {
	title?: string;
	description?: string;
	galleryPath?: string;
	className?: string;
};

export const GalleryBanner = ({
	title = "Explore Pattern Gallery",
	description = "See real-world implementations and examples",
	galleryPath = "https://gallery.uxpatterns.dev",
	className,
}: GalleryBannerProps) => {
	const plausible = usePlausible();

	return (
		<Link
			href={galleryPath}
			className={cn(
				"not-prose group relative mb-8 flex items-center justify-between rounded-lg",
				"border border-border/50 overflow-hidden",
				"px-4 py-3 transition-all duration-200",
				"hover:border-primary/30 hover:shadow-md",
				className,
			)}
			onClick={() => {
				plausible("Gallery Banner Click", {
					props: {
						gallery_path: galleryPath,
						title: title,
					},
				});
			}}
		>
			{/* Background gradient animation */}
			<div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />

			{/* Animated SVG pattern */}
			<svg
				className="absolute inset-0 w-full h-full opacity-10"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<pattern
						id="gallery-pattern"
						x="0"
						y="0"
						width="40"
						height="40"
						patternUnits="userSpaceOnUse"
					>
						<circle
							cx="20"
							cy="20"
							r="1.5"
							fill="currentColor"
							className="text-primary"
						>
							<animate
								attributeName="r"
								values="1.5;2.5;1.5"
								dur="3s"
								repeatCount="indefinite"
							/>
						</circle>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#gallery-pattern)" />
			</svg>

			<div className="relative flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
					<Sparkles className="h-5 w-5 text-primary" />
				</div>
				<div className="flex flex-col">
					<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
						UX Patterns Gallery
					</span>
					<span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
						{title}
					</span>
					<span className="text-xs text-muted-foreground mt-0.5">
						{description}
					</span>
				</div>
			</div>
			<ArrowRight className="relative h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
		</Link>
	);
};
