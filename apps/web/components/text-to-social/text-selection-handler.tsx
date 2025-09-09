"use client";

import { Instagram, Linkedin, Twitter } from "lucide-react";
import { usePlausible } from "next-plausible";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { trackTextToSocialEvent } from "@/utils/tracking";

interface SelectionPopoverProps {
	selectedText: string;
	position: { x: number; y: number };
	onClose: () => void;
}

function SelectionPopover({
	selectedText,
	position,
	onClose,
}: SelectionPopoverProps) {
	const [isGenerating, setIsGenerating] = useState(false);
	const popoverRef = useRef<HTMLDivElement>(null);
	const plausible = usePlausible();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	const generateImage = async (
		platform: "instagram" | "twitter" | "linkedin",
	) => {
		setIsGenerating(true);

		try {
			// Get the page title from the document
			const pageTitle = document.title
				.replace(" | UX Patterns for Developers", "")
				.replace(" - UX Patterns for Developers", "");
			// Get the current page URL
			const pageUrl = window.location.href;

			const response = await fetch("/api/social-image", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text: selectedText,
					platform,
					patternName: pageTitle,
					pageUrl,
				}),
			});

			if (!response.ok) throw new Error("Failed to generate image");

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);

			// Download the image
			const a = document.createElement("a");
			a.href = url;
			a.download = `quote-${platform}-${Date.now()}.png`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			// Track successful generation
			trackTextToSocialEvent(plausible, "image_generated", {
				platform,
				textLength: selectedText.length,
				patternName: pageTitle,
			});

			// Track successful image download
			trackTextToSocialEvent(plausible, "image_download", {
				platform,
				textLength: selectedText.length,
				patternName: pageTitle,
			});

			onClose();
		} catch (error) {
			console.error("Error generating image:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div
			ref={popoverRef}
			className={cn(
				"absolute z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2",
				"animate-in fade-in-0 zoom-in-95 duration-100",
			)}
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				transform: "translate(-50%, -100%)",
				marginTop: "-8px",
			}}
		>
			<div className="flex items-center gap-1">
				<button
					type="button"
					onClick={() => generateImage("instagram")}
					disabled={isGenerating}
					className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50"
					title="Share as Instagram post"
				>
					<Instagram className="w-4 h-4" />
				</button>
				<button
					type="button"
					onClick={() => generateImage("twitter")}
					disabled={isGenerating}
					className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50"
					title="Share as Twitter/X post"
				>
					<Twitter className="w-4 h-4" />
				</button>
				<button
					type="button"
					onClick={() => generateImage("linkedin")}
					disabled={isGenerating}
					className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50"
					title="Share as LinkedIn post"
				>
					<Linkedin className="w-4 h-4" />
				</button>
			</div>
			{isGenerating && (
				<div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
					Generating...
				</div>
			)}
		</div>
	);
}

export function TextSelectionHandler() {
	const [selectedText, setSelectedText] = useState("");
	const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
	const [showPopover, setShowPopover] = useState(false);
	const plausible = usePlausible();

	const handleTextSelection = useCallback(() => {
		const selection = window.getSelection();
		if (!selection || selection.isCollapsed) {
			setShowPopover(false);
			return;
		}

		const text = selection.toString().trim();

		// Check if selection is inside inappropriate elements
		const range = selection.getRangeAt(0);
		const commonAncestor = range.commonAncestorContainer;
		const parentElement =
			commonAncestor.nodeType === Node.TEXT_NODE
				? commonAncestor.parentElement
				: (commonAncestor as Element);

		// Elements where text-to-social should not appear
		const excludedElements = [
			"pre",
			"code", // Code blocks
			"input",
			"textarea",
			"select",
			"button", // Form elements
			"nav",
			"header",
			"footer", // Navigation/chrome
			"a", // Links (text without context)
			"time", // Timestamps
			'[role="navigation"]', // ARIA navigation
			'[role="button"]', // ARIA buttons
			'[role="tab"]', // Tabs
			'[role="menuitem"]', // Menu items
			".nextra-nav", // Nextra navigation
			".nextra-sidebar", // Nextra sidebar
			".nextra-toc", // Table of contents
			".nextra-breadcrumb", // Breadcrumbs
		];

		// Check if selection is within any excluded element
		if (
			parentElement &&
			excludedElements.some((selector) => {
				try {
					return parentElement.closest(selector);
				} catch {
					// Handle invalid selectors gracefully
					return false;
				}
			})
		) {
			setShowPopover(false);
			return;
		}

		// Additional check for URLs, emails, and technical patterns
		const urlPattern = /^https?:\/\/|^www\.|@.*\.|^\+?\d+[\d\s\-()]+$/i;
		if (urlPattern.test(text.trim())) {
			setShowPopover(false);
			return;
		}

		// Only show for meaningful selections (more than 10 characters)
		if (text.length > 10 && text.length < 500) {
			const rect = range.getBoundingClientRect();

			// Get HTML content to preserve formatting
			const container = document.createElement("div");
			container.appendChild(range.cloneContents());

			// Extract text with bold markers
			let formattedText = "";
			const walkNodes = (node: Node) => {
				if (node.nodeType === Node.TEXT_NODE) {
					formattedText += node.textContent;
				} else if (node.nodeType === Node.ELEMENT_NODE) {
					const element = node as Element;
					const computedStyle = window.getComputedStyle(element);
					const fwRaw = computedStyle.fontWeight;
					const fontWeight =
						fwRaw === "bold" ? 700 : parseInt(fwRaw as string, 10) || 400;

					// Check for bold elements (including computed styles)
					if (
						element.tagName === "STRONG" ||
						element.tagName === "B" ||
						element.classList.contains("font-bold") ||
						element.classList.contains("font-semibold") ||
						fontWeight >= 600
					) {
						formattedText += "**";
						for (const child of Array.from(node.childNodes)) {
							walkNodes(child);
						}
						formattedText += "**";
					} else {
						for (const child of Array.from(node.childNodes)) {
							walkNodes(child);
						}
					}
				}
			};

			for (const child of Array.from(container.childNodes)) {
				walkNodes(child);
			}

			setSelectedText(formattedText.trim() || text);
			setPopoverPosition({
				x: rect.left + rect.width / 2,
				y: rect.top + window.scrollY,
			});
			setShowPopover(true);

			// Track popover appearance
			trackTextToSocialEvent(plausible, "popover_shown", {
				textLength: (formattedText.trim() || text).length,
				patternName: document.title
					.replace(" | UX Patterns for Developers", "")
					.replace(" - UX Patterns for Developers", ""),
			});
		} else {
			setShowPopover(false);
		}
	}, [plausible]);

	useEffect(() => {
		// Debounce the selection handler
		let timeoutId: ReturnType<typeof setTimeout>;

		const debouncedHandler = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(handleTextSelection, 300);
		};

		document.addEventListener("selectionchange", debouncedHandler);
		document.addEventListener("mouseup", debouncedHandler);

		return () => {
			document.removeEventListener("selectionchange", debouncedHandler);
			document.removeEventListener("mouseup", debouncedHandler);
			clearTimeout(timeoutId);
		};
	}, [handleTextSelection]);

	if (!showPopover) return null;

	return (
		<SelectionPopover
			selectedText={selectedText}
			position={popoverPosition}
			onClose={() => setShowPopover(false)}
		/>
	);
}
