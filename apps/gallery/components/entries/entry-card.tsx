"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getImagePath } from "@/lib/image-utils";
import type { Entry } from "@/lib/types";
import { getCategoryForPattern } from "@/lib/url-utils";
import { cn } from "@/lib/utils";
import { VerdictChip } from "../common/verdict-chip";
import { WebsitePill } from "../common/website-pill";

interface EntryCardProps {
	entry: Entry;
	className?: string;
}

export function EntryCard({ entry, className }: EntryCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false);

	// Generate URL for the entry
	const normalizedPattern = entry.pattern.toLowerCase().replace(/\s+/g, "-");
	const category = getCategoryForPattern(normalizedPattern) || "navigation";
	const href = `/${entry.platform}/${category}/${normalizedPattern}/${entry.type}/${entry.id}`;

	return (
		<Link
			href={href}
			className={cn(
				"group block rounded-2xl bg-fd-card border border-fd-border overflow-hidden",
				"hover:border-fd-border/80 hover:shadow-lg transition-all duration-200",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary focus-visible:ring-offset-2",
				className,
			)}
		>
			{/* Media */}
			<div className="relative aspect-[4/3] bg-fd-background overflow-hidden">
				{/* Skeleton loader */}
				{!imageLoaded && entry.media.type === "image" && (
					<div className="absolute inset-0 bg-gradient-to-r from-fd-muted via-fd-muted/80 to-fd-muted animate-pulse" />
				)}

				{entry.media.type === "image" ? (
					<Image
						src={getImagePath(entry)}
						alt={entry.title}
						fill
						className={cn(
							"object-contain group-hover:scale-105 transition-transform duration-300",
							!imageLoaded && "opacity-0",
						)}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						placeholder="blur"
						blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmkjdHjfTzRm0XzqMjlvqvFRKHuIWl+9EbkJPgKKKCv/Z"
						onLoad={() => setImageLoaded(true)}
					/>
				) : (
					<div className="flex items-center justify-center h-full text-fd-muted-foreground">
						<span>Video content</span>
					</div>
				)}

				{/* Verdict chip on image - only show after image loads */}
				{(imageLoaded || entry.media.type !== "image") && (
					<div className="absolute top-3 right-3">
						<VerdictChip type={entry.type} variant="overlay" />
					</div>
				)}
			</div>

			{/* Card content */}
			<div className="p-3 space-y-2 text-left">
				{/* Pattern name */}
				<div className="flex items-center">
					<span className="inline-block px-2 py-1 text-xs font-medium bg-fd-muted text-fd-muted-foreground rounded-md">
						{entry.pattern}
					</span>
				</div>

				{/* Title */}
				<h3 className="font-medium text-fd-foreground leading-tight line-clamp-2 text-base group-hover:text-fd-primary transition-colors">
					{entry.title}
				</h3>

				{/* Website */}
				<WebsitePill website={entry.website} platform={entry.platform} />
			</div>
		</Link>
	);
}
