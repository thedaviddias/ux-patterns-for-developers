"use client";

import { cn } from "@ux-patterns/ui/lib/utils";
import * as React from "react";

interface CodeSectionProps {
	children: React.ReactNode;
	isExpanded?: boolean;
	shouldShowExpand?: boolean;
	onShouldShowExpandChange?: (shouldShow: boolean) => void;
	onCodeContentChange?: (content: string) => void;
}

export function CodeSection({
	children,
	isExpanded = false,
	shouldShowExpand: shouldShowExpandProp,
	onShouldShowExpandChange,
	onCodeContentChange,
}: CodeSectionProps) {
	const [internalShouldShow, setInternalShouldShow] = React.useState(false);
	const codeRef = React.useRef<HTMLDivElement>(null);

	// Use prop if provided, otherwise use internal state
	const shouldShowExpand = shouldShowExpandProp ?? internalShouldShow;

	// Check if content is tall enough to need expand functionality
	React.useEffect(() => {
		const checkHeight = () => {
			if (codeRef.current) {
				const preElement = codeRef.current.querySelector("pre");
				if (preElement) {
					// Try multiple height measurements
					const scrollHeight = preElement.scrollHeight;
					const clientHeight = preElement.clientHeight;
					const offsetHeight = preElement.offsetHeight;

					// Count lines as fallback
					const codeElement = preElement.querySelector("code");
					const lineCount = codeElement
						? codeElement.textContent?.split("\n").length || 0
						: 0;

					// Consider it tall if any height > 350 OR if we have many lines
					const shouldShow =
						scrollHeight > 350 ||
						clientHeight > 350 ||
						offsetHeight > 350 ||
						lineCount > 15;

					setInternalShouldShow(shouldShow);
					onShouldShowExpandChange?.(shouldShow);

					// Extract code content for copying
					if (onCodeContentChange) {
						const codeElement = preElement.querySelector("code");
						if (codeElement?.textContent) {
							onCodeContentChange(codeElement.textContent);
						}
					}
				}
			}
		};

		// Check multiple times to catch async content loading
		const timer1 = setTimeout(checkHeight, 100);
		const timer2 = setTimeout(checkHeight, 500);
		const timer3 = setTimeout(checkHeight, 1000);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
		};
	}, [onCodeContentChange, onShouldShowExpandChange]);

	// Apply styles directly to pre elements
	React.useEffect(() => {
		if (codeRef.current) {
			const preElements = codeRef.current.querySelectorAll("pre");
			preElements.forEach((pre) => {
				if (shouldShowExpand && !isExpanded) {
					pre.style.maxHeight = "350px";
					pre.style.overflow = "hidden";
				} else {
					pre.style.maxHeight = "none";
					pre.style.overflow = "visible";
				}
			});
		}
	}, [isExpanded, shouldShowExpand]);

	return (
		<div className="flex flex-col space-y-4">
			<div
				ref={codeRef}
				className={cn(
					"w-full transition-all duration-200 relative",
					shouldShowExpand ? "rounded-t-none rounded-b-md" : "rounded-md",
					"[&_pre]:my-0",
				)}
			>
				{children}
				{/* Gradient fade overlay when collapsed - larger and more prominent */}
				{shouldShowExpand && !isExpanded && (
					<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none rounded-b-md" />
				)}
			</div>
		</div>
	);
}
