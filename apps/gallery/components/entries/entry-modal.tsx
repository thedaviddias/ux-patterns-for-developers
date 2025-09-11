"use client";

import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "@ux-patterns/ui/components/shadcn/dialog";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ROUTES } from "@/lib/routes";
import type { Entry } from "@/lib/types";
import { getCategoryForPattern } from "@/lib/url-utils";
import { VerdictChip } from "../common/verdict-chip";
import { WebsitePill } from "../common/website-pill";

interface EntryModalProps {
	entry: Entry;
	isOpen: boolean;
	onClose: () => void;
	onPrevious?: () => void;
	onNext?: () => void;
	hasPrevious?: boolean;
	hasNext?: boolean;
}

export function EntryModal({
	entry,
	isOpen,
	onClose,
	onPrevious,
	onNext,
	hasPrevious,
	hasNext,
}: EntryModalProps) {
	const [isShared, setIsShared] = useState(false);

	const handleShare = async () => {
		try {
			const url = window.location.href;
			await navigator.clipboard.writeText(url);
			setIsShared(true);
			// Reset after 2 seconds
			setTimeout(() => setIsShared(false), 2000);
		} catch (err) {
			console.error("Failed to copy URL:", err);
		}
	};

	// Radix UI Dialog handles escape key and body scroll automatically

	if (!isOpen) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="p-0 overflow-hidden bg-fd-background max-w-7xl w-full h-[90vh]">
				<DialogTitle className="sr-only">Entry Details</DialogTitle>
				<div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden flex flex-col">
					{/* Navigation arrows inside modal */}
					{hasPrevious && onPrevious && (
						<button
							type="button"
							onClick={onPrevious}
							className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
						>
							<ArrowLeft className="w-6 h-6" />
							<span className="sr-only">Previous</span>
						</button>
					)}

					{hasNext && onNext && (
						<button
							type="button"
							onClick={onNext}
							className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
						>
							<ArrowRight className="w-6 h-6" />
							<span className="sr-only">Next</span>
						</button>
					)}
					{/* Header */}
					<header className="p-6 border-b border-fd-border bg-fd-background">
						<div className="flex items-start justify-between">
							{/* Left: Title and website info */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-3 mb-2">
									<VerdictChip type={entry.type} />
								</div>
								<h1 className="text-2xl font-bold text-fd-foreground mb-2">
									{entry.title}
								</h1>
								<a
									href={`https://${entry.website}`}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block hover:opacity-80 transition-opacity"
								>
									<WebsitePill
										website={entry.website}
										platform={entry.platform}
									/>
								</a>
							</div>

							{/* Right: Share and close */}
							<div className="flex items-center gap-3 ml-4">
								<button
									type="button"
									onClick={handleShare}
									className="px-3 py-1.5 bg-fd-primary text-fd-primary-foreground rounded-lg text-sm font-medium hover:bg-fd-primary/90 transition-colors flex items-center gap-1.5"
								>
									{isShared ? (
										<>
											<Check className="w-4 h-4" />
											URL copied
										</>
									) : (
										"Share"
									)}
								</button>
								<button
									type="button"
									onClick={onClose}
									className="p-2 hover:bg-fd-muted rounded-full transition-colors"
								>
									<X className="w-5 h-5" />
									<span className="sr-only">Close</span>
								</button>
							</div>
						</div>
					</header>

					{/* Image */}
					<div className="flex-1 relative bg-fd-muted min-h-0 p-8">
						<div className="w-full h-full relative flex items-center justify-center">
							{entry.media.type === "image" ? (
								<Image
									src={entry.media.src}
									alt={entry.title}
									width={1024}
									height={1024}
									className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
									priority
								/>
							) : (
								<div className="flex items-center justify-center h-96 w-full text-fd-muted-foreground bg-fd-muted rounded-lg">
									<span>Video content</span>
								</div>
							)}
						</div>
					</div>

					{/* Footer */}
					<footer className="p-6 border-t border-fd-border bg-fd-background">
						<div>
							{/* Analysis */}
							<div>
								<h3 className="text-sm font-semibold text-fd-foreground mb-2">
									Analysis
								</h3>
								<p className="text-sm text-fd-muted-foreground line-clamp-2">
									{entry.content}
								</p>
							</div>
						</div>

						{/* Pattern Filter */}
						<div className="mt-4 pt-4 border-t border-fd-border">
							<div className="flex items-center gap-3">
								<span className="text-sm font-medium text-fd-muted-foreground">
									Patterns
								</span>
								<button
									type="button"
									onClick={() => {
										// Close modal and apply pattern filter
										onClose();
										// Navigate to new pattern URL
										const urlPattern = entry.pattern
											.toLowerCase()
											.replace(/\s+/g, "-");
										const category = getCategoryForPattern(urlPattern);
										if (category) {
											window.location.href = ROUTES.pattern(
												entry.platform,
												category,
												urlPattern,
											);
										} else {
											// Fallback to platform with pattern query
											window.location.href = ROUTES.withQuery(
												ROUTES.platform(entry.platform),
												{ pattern: urlPattern },
											);
										}
									}}
									className="px-4 py-2 bg-fd-muted hover:bg-fd-muted/80 text-fd-foreground text-sm font-medium rounded-lg transition-colors border border-fd-border hover:border-fd-border/80"
								>
									{entry.pattern}
								</button>
							</div>
						</div>
					</footer>
				</div>
			</DialogContent>
		</Dialog>
	);
}
