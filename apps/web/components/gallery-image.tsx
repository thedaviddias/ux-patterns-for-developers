import Image from "next/image";
import { cn } from "@/lib/cn";

interface GalleryImageProps {
	src: string;
	alt: string;
	caption?: string;
	className?: string;
	width?: number;
	height?: number;
	priority?: boolean;
}

/**
 * Component for displaying images from the gallery app
 * Handles both local and cross-app image references
 */
export function GalleryImage({
	src,
	alt,
	caption,
	className,
	width = 800,
	height = 600,
	priority = false,
}: GalleryImageProps) {
	// If src starts with /gallery/, it's a cross-app reference
	const imageSrc = src.startsWith("/gallery/")
		? src.replace("/gallery/", "/images/gallery/")
		: src;

	return (
		<figure className={cn("my-6", className)}>
			<div className="relative overflow-hidden rounded-lg border bg-muted">
				<Image
					src={imageSrc}
					alt={alt}
					width={width}
					height={height}
					priority={priority}
					className="object-cover object-top"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
				/>
			</div>
			{caption && (
				<figcaption className="mt-2 text-center text-sm text-muted-foreground">
					{caption}
				</figcaption>
			)}
		</figure>
	);
}
