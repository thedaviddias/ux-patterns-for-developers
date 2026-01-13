"use client";

import { cn } from "@/lib/cn";
import type { TocItem } from "@/lib/content";
import { useEffect, useState, useCallback, useRef } from "react";

interface TocProps {
	items: TocItem[];
	className?: string;
}

/**
 * Flatten TOC items to get all heading IDs
 */
function flattenTocItems(items: TocItem[]): string[] {
	const result: string[] = [];
	for (const item of items) {
		result.push(item.url.slice(1)); // Remove # prefix
		if (item.items && item.items.length > 0) {
			result.push(...flattenTocItems(item.items));
		}
	}
	return result;
}

/**
 * Table of Contents Component
 *
 * Features:
 * - Highlights active section based on scroll position
 * - Smooth scroll to section on click
 * - Nested heading support
 * - Accessible navigation
 *
 * Uses scroll position tracking (like Fumadocs) instead of IntersectionObserver
 * for more stable active state detection.
 */
export function Toc({ items, className }: TocProps) {
	const [activeId, setActiveId] = useState<string>("");
	const headingIdsRef = useRef<string[]>([]);

	// Get all heading IDs once
	useEffect(() => {
		headingIdsRef.current = flattenTocItems(items);
	}, [items]);

	// Scroll-based active heading detection (Fumadocs approach)
	const updateActiveHeading = useCallback(() => {
		const headingIds = headingIdsRef.current;
		if (headingIds.length === 0) return;

		// Get all heading elements with their positions
		const headingElements: { id: string; top: number }[] = [];
		for (const id of headingIds) {
			const element = document.getElementById(id);
			if (element) {
				const rect = element.getBoundingClientRect();
				headingElements.push({ id, top: rect.top });
			}
		}

		if (headingElements.length === 0) return;

		// Find the heading that's closest to the top but still visible
		// Use a threshold slightly below the top of the viewport
		const threshold = 100; // Account for fixed header

		// Find the last heading that has scrolled past the threshold
		let activeHeading = headingElements[0].id;
		for (const heading of headingElements) {
			if (heading.top <= threshold) {
				activeHeading = heading.id;
			} else {
				break;
			}
		}

		setActiveId(activeHeading);
	}, []);

	useEffect(() => {
		// Initial calculation
		updateActiveHeading();

		// Simple scroll handler - runs on every scroll event
		// Modern browsers optimize passive scroll listeners well
		const handleScroll = () => {
			updateActiveHeading();
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		// Also update on resize (heading positions may change)
		window.addEventListener("resize", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, [updateActiveHeading]);

	if (items.length === 0) {
		return null;
	}

	return (
		<nav
			className={cn("space-y-2", className)}
			aria-label="Table of contents"
		>
			<h2 className="text-sm font-semibold">On this page</h2>
			<TocList items={items} activeId={activeId} level={0} />
		</nav>
	);
}

interface TocListProps {
	items: TocItem[];
	activeId: string;
	level: number;
}

function TocList({ items, activeId, level }: TocListProps) {
	return (
		<ul className={cn("space-y-1", level > 0 && "ml-3 border-l pl-3")}>
			{items.map((item) => (
				<TocListItem
					key={item.url}
					item={item}
					activeId={activeId}
					level={level}
				/>
			))}
		</ul>
	);
}

interface TocListItemProps {
	item: TocItem;
	activeId: string;
	level: number;
}

function TocListItem({ item, activeId, level }: TocListItemProps) {
	const id = item.url.slice(1); // Remove # prefix
	const isActive = activeId === id;

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		const element = document.getElementById(id);
		if (element) {
			// Smooth scroll with offset for fixed header
			const offset = 100;
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.scrollY - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});

			// Update URL hash without scrolling
			history.pushState(null, "", item.url);
		}
	};

	return (
		<li>
			<a
				href={item.url}
				onClick={handleClick}
				className={cn(
					"block py-1 text-sm transition-colors",
					"hover:text-foreground",
					isActive
						? "font-medium text-primary"
						: "text-muted-foreground"
				)}
				aria-current={isActive ? "location" : undefined}
			>
				{item.title}
			</a>
			{item.items && item.items.length > 0 && (
				<TocList items={item.items} activeId={activeId} level={level + 1} />
			)}
		</li>
	);
}

/**
 * Sticky TOC wrapper for desktop layout
 */
export function TocWrapper({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<aside
			className={cn(
				"hidden xl:block",
				"sticky top-20 h-[calc(100vh-5rem)] w-64 shrink-0",
				"py-6 pr-4",
				// Hide scrollbar but allow scrolling if needed
				"overflow-y-auto scrollbar-none",
				// Fallback for browsers that don't support scrollbar-none
				"[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
				className
			)}
		>
			{children}
		</aside>
	);
}
