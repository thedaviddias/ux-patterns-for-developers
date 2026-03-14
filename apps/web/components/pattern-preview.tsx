"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { getPatternCoverSrc } from "@/lib/pattern-cover-assets";

export const PatternPreview = ({ alt }: { alt: string }) => {
	const pathname = usePathname();
	const segments = pathname.split("/");
	const patternName = segments[segments.length - 1];
	const coverSrc = getPatternCoverSrc(patternName);

	return (
		<div className="pattern-preview not-prose my-6 overflow-hidden rounded-[1.75rem] border border-border/70 bg-card">
			{coverSrc ? (
				<Image
					src={coverSrc}
					alt={alt || `Example of ${patternName} pattern`}
					width={900}
					height={500}
					priority
					unoptimized
					className="h-auto w-full"
				/>
			) : (
				<div className="flex min-h-[280px] items-end bg-[radial-gradient(circle_at_top_left,_rgba(214,163,65,0.18),_transparent_42%),linear-gradient(135deg,_rgba(15,23,42,0.92),_rgba(15,23,42,0.72))] p-8">
					<div className="max-w-xl">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
							Pattern Preview
						</p>
						<h3 className="mt-3 text-3xl font-semibold text-white">
							{alt || patternName}
						</h3>
					</div>
				</div>
			)}
		</div>
	);
};
