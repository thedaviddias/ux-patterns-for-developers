"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
	title: string;
	text?: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleShare = async () => {
		const url = window.location.href;

		// Check if it's a mobile device and native share API is available
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		if (isMobile && navigator.share) {
			// Use native share on mobile devices
			try {
				await navigator.share({
					title,
					text: text || title,
					url,
				});
			} catch (err) {
				// User cancelled or error occurred
				if (err instanceof Error && err.name !== "AbortError") {
					console.error("Error sharing:", err);
				}
			}
		} else {
			// Copy to clipboard on desktop
			try {
				await navigator.clipboard.writeText(url);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch (err) {
				console.error("Failed to copy:", err);
			}
		}
	};

	return (
		<button
			type="button"
			onClick={handleShare}
			className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted rounded-lg transition-colors"
			aria-label="Share this page"
		>
			{copied ? (
				<>
					<Check className="w-4 h-4" />
					<span>Copied!</span>
				</>
			) : (
				<>
					<Copy className="w-4 h-4" />
					<span>Share</span>
				</>
			)}
		</button>
	);
}
