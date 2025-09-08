"use client";

import Image from "next/image";
import type { Entry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { VerdictChip } from "../common/verdict-chip";
import { WebsitePill } from "../common/website-pill";

interface EntryCardProps {
	entry: Entry;
	className?: string;
	onClick?: () => void;
}

export function EntryCard({ entry, className, onClick }: EntryCardProps) {
	return (
		<button
			onClick={onClick}
			type="button"
			className={cn(
				"group block rounded-2xl bg-fd-card border border-fd-border overflow-hidden",
				"hover:border-fd-border/80 hover:shadow-lg transition-all duration-200",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary focus-visible:ring-offset-2",
				className,
			)}
		>
			{/* Media */}
			<div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
				{entry.media.type === "image" ? (
					<Image
						src={entry.media.src}
						alt={entry.notes}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						placeholder="blur"
						blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmkjdHjfTzRm0XzqMjlvqvFRKHuIWl+9EbkJPgKKKCv/Z"
					/>
				) : (
					<div className="flex items-center justify-center h-full text-gray-500">
						<span>Video content</span>
					</div>
				)}

				{/* Verdict chip on image */}
				<div className="absolute top-3 right-3">
					<VerdictChip type={entry.type} variant="overlay" />
				</div>
			</div>

			{/* Card content */}
			<div className="p-3 space-y-2 text-left">
				{/* Pattern name */}
				<div className="flex items-center">
					<span className="text-xs font-medium text-fd-muted-foreground truncate">
						{entry.pattern}
					</span>
				</div>

				{/* Title */}
				<h3 className="font-medium text-fd-foreground leading-tight line-clamp-2 text-sm group-hover:text-fd-primary transition-colors">
					{entry.title}
				</h3>

				{/* Website */}
				<WebsitePill website={entry.website} platform={entry.platform} />
			</div>
		</button>
	);
}
