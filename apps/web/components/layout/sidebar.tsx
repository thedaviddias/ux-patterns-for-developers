"use client";

import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
} from "react";
import { cn } from "@/lib/cn";
import type { PageTreeFolder, PageTreeItem, PageTreeNode } from "@/lib/content";
import { useSidebar } from "./sidebar-context";

function renderTreeIcon(iconName: string | undefined) {
	if (!iconName) {
		return null;
	}

	const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[
		iconName
	];

	if (!IconComponent) {
		return null;
	}

	return <IconComponent className="h-4 w-4" aria-hidden="true" />;
}

function getNodeKey(node: PageTreeNode) {
	if (node.type === "separator") {
		return `separator:${node.name}`;
	}

	if (node.type === "folder") {
		return `folder:${node.index?.url ?? node.name}`;
	}

	return `page:${node.url}`;
}

interface SidebarProps {
	tree: PageTreeNode[];
	header?: ReactNode;
	footer?: ReactNode;
	/** Variant: "desktop" for in-flow sidebar, "mobile" for fixed overlay */
	variant?: "desktop" | "mobile";
}

/**
 * Sidebar Component
 *
 * Features:
 * - Collapsible folders with expand/collapse memory
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Scroll position memory
 * - Mobile slide-out drawer
 * - Hidden scrollbar (visible on hover)
 */
export function Sidebar({
	tree,
	header,
	footer,
	variant = "desktop",
}: SidebarProps) {
	const { open, setOpen, scrollPosition, setScrollPosition, hasHydrated } =
		useSidebar();
	const scrollRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const hasRestoredScrollRef = useRef(false);
	const lastPathnameRef = useRef<string | null>(null);

	// Restore the sidebar's saved scroll after hydration and on route changes.
	useLayoutEffect(() => {
		if (!hasHydrated || !scrollRef.current) return;

		const isFirstHydratedRender = !hasRestoredScrollRef.current;
		const isPathChange = lastPathnameRef.current !== pathname;

		if (isFirstHydratedRender || isPathChange) {
			scrollRef.current.scrollTop = scrollPosition;
			hasRestoredScrollRef.current = true;
		}

		lastPathnameRef.current = pathname;
	}, [hasHydrated, pathname, scrollPosition]);

	// Save scroll position on scroll
	const handleScroll = useCallback(() => {
		if (scrollRef.current) {
			setScrollPosition(scrollRef.current.scrollTop);
		}
	}, [setScrollPosition]);

	// Close mobile sidebar on navigation
	useEffect(() => {
		if (variant === "mobile" && pathname) {
			setOpen(false);
		}
	}, [pathname, setOpen, variant]);

	// Close mobile sidebar on escape
	useEffect(() => {
		if (variant !== "mobile") return;
		const handleEscape = (e: globalThis.KeyboardEvent) => {
			if (e.key === "Escape" && open) {
				setOpen(false);
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [open, setOpen, variant]);

	// Desktop variant - simple in-flow sidebar
	if (variant === "desktop") {
		return (
			<div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 backdrop-blur">
				{header && (
					<div className="border-b border-border/70 px-5 py-4">{header}</div>
				)}

				{/* Navigation */}
				<nav
					ref={scrollRef}
					onScroll={handleScroll}
					className="sidebar-scroll flex-1 overflow-y-auto px-4 py-4"
					aria-label="Documentation navigation"
				>
					<SidebarTree nodes={tree} level={0} />
				</nav>

				{/* Footer */}
				{footer && (
					<div className="border-t border-border/70 px-5 py-4">{footer}</div>
				)}
			</div>
		);
	}

	// Mobile variant - fixed overlay
	return (
		<>
			{/* Mobile overlay */}
			{open && (
				<div
					className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
					onClick={() => setOpen(false)}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed top-16 left-4 z-40 h-[calc(100vh-5rem)] w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 shadow-[0_28px_90px_-55px_rgba(15,23,42,0.65)] backdrop-blur transition-transform duration-300 ease-in-out md:hidden",
					open ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]",
				)}
			>
				<div className="flex h-full flex-col">
					{/* Mobile header with close button */}
					<div className="flex h-14 items-center justify-between border-b border-border/70 px-5">
						<span className="font-semibold">Navigation</span>
						<button
							type="button"
							className="rounded-xl p-2 hover:bg-accent"
							onClick={() => setOpen(false)}
							aria-label="Close sidebar"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{header && (
						<div className="border-b border-border/70 px-5 py-4">{header}</div>
					)}

					{/* Navigation */}
					<nav
						ref={scrollRef}
						onScroll={handleScroll}
						className="sidebar-scroll flex-1 overflow-y-auto px-4 py-4"
						aria-label="Documentation navigation"
					>
						<SidebarTree nodes={tree} level={0} />
					</nav>

					{/* Footer */}
					{footer && (
						<div className="border-t border-border/70 px-5 py-4">{footer}</div>
					)}
				</div>
			</aside>
		</>
	);
}

interface SidebarTreeProps {
	nodes: PageTreeNode[];
	level: number;
}

function SidebarTree({ nodes, level }: SidebarTreeProps) {
	return (
		<ul
			className="space-y-1"
			aria-label={level === 0 ? "Navigation" : undefined}
		>
			{nodes.map((node) => (
				<SidebarNode key={getNodeKey(node)} node={node} level={level} />
			))}
		</ul>
	);
}

interface SidebarNodeProps {
	node: PageTreeNode;
	level: number;
}

function SidebarNode({ node, level }: SidebarNodeProps) {
	if (node.type === "separator") {
		return (
			<li className="pt-4 pb-1 first:pt-0">
				<span className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					{node.name}
				</span>
			</li>
		);
	}

	if (node.type === "folder") {
		// All folders use SidebarFolder - level 0 folders will be auto-expanded
		return <SidebarFolder folder={node} level={level} />;
	}

	return <SidebarItem item={node} level={level} />;
}

interface SidebarFolderProps {
	folder: PageTreeFolder;
	level: number;
}

function SidebarFolder({ folder, level }: SidebarFolderProps) {
	const {
		expandedPaths,
		togglePath,
		expandPath,
		defaultOpenLevel,
		hasHydrated,
		hadStoredData,
	} = useSidebar();
	const pathname = usePathname();
	const folderPath = folder.index?.url || folder.name;
	const buttonRef = useRef<HTMLButtonElement>(null);

	// Auto-expand if current path is within this folder
	const isActive = folder.index?.url === pathname;
	const hasActiveChild = folder.children.some((child) => {
		if (child.type === "page") return child.url === pathname;
		if (child.type === "folder") {
			return (
				child.index?.url === pathname ||
				child.children.some((c) => c.type === "page" && c.url === pathname)
			);
		}
		return false;
	});

	// Determine if folder should be auto-expanded by default
	const shouldDefaultExpand =
		level < defaultOpenLevel || isActive || hasActiveChild;

	// Compute expanded state:
	// - Before hydration OR first visit (no stored data): show defaults
	// - After hydration with stored data: use localStorage state (user preferences)
	const isExpanded =
		hasHydrated && hadStoredData
			? expandedPaths.has(folderPath)
			: shouldDefaultExpand;

	// After hydration, if this is a first visit, persist default-expanded folders to state
	useEffect(() => {
		if (
			hasHydrated &&
			!hadStoredData &&
			shouldDefaultExpand &&
			!expandedPaths.has(folderPath)
		) {
			expandPath(folderPath);
		}
	}, [
		hasHydrated,
		hadStoredData,
		shouldDefaultExpand,
		expandedPaths,
		folderPath,
		expandPath,
	]);

	const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
		switch (e.key) {
			case "ArrowRight":
				if (!isExpanded) {
					e.preventDefault();
					togglePath(folderPath);
				}
				break;
			case "ArrowLeft":
				if (isExpanded) {
					e.preventDefault();
					togglePath(folderPath);
				}
				break;
			case "Enter":
			case " ":
				e.preventDefault();
				togglePath(folderPath);
				break;
		}
	};

	return (
		<li>
			<div className="flex items-center">
				<button
					type="button"
					ref={buttonRef}
					onClick={() => togglePath(folderPath)}
					onKeyDown={handleKeyDown}
					aria-expanded={isExpanded}
					className={cn(
						"flex w-full items-start gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
						"hover:bg-muted/80 hover:text-foreground",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						(isActive || hasActiveChild) &&
							"bg-background/90 text-foreground font-medium shadow-sm",
					)}
					style={{ paddingLeft: `${level * 12 + 12}px` }}
					aria-label={`${folder.name}, ${isExpanded ? "expanded" : "collapsed"}`}
				>
					<ChevronRight
						className={cn(
							"h-4 w-4 shrink-0 transition-transform duration-200",
							isExpanded && "rotate-90",
						)}
					/>
					{renderTreeIcon(folder.icon)}
					<span className="line-clamp-2">{folder.name}</span>
				</button>
			</div>

			{isExpanded && (
				<ul className="mt-1">
					{/* Folder children */}
					{folder.children.map((child) => (
						<SidebarNode
							key={getNodeKey(child)}
							node={child}
							level={level + 1}
						/>
					))}
				</ul>
			)}
		</li>
	);
}

interface SidebarItemProps {
	item: PageTreeItem;
	level: number;
}

function SidebarItem({ item, level }: SidebarItemProps) {
	const pathname = usePathname();
	const isActive = item.url === pathname;
	const linkRef = useRef<HTMLAnchorElement>(null);

	const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
		if (e.key === "Enter") {
			linkRef.current?.click();
		}
	};

	return (
		<li>
			<Link
				ref={linkRef}
				href={item.url}
				onKeyDown={handleKeyDown}
				target={item.external ? "_blank" : undefined}
				rel={item.external ? "noopener noreferrer" : undefined}
				className={cn(
					"flex items-start gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
					"hover:bg-muted/80 hover:text-foreground",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					isActive
						? "bg-background/90 text-foreground font-medium shadow-sm"
						: "text-muted-foreground",
				)}
				style={{ paddingLeft: `${level * 12 + 12}px` }}
				aria-current={isActive ? "page" : undefined}
			>
				{renderTreeIcon(item.icon)}
				<span className="line-clamp-2 flex-1">{item.name}</span>
				{item.draft && (
					<>
						<span
							className="h-2 w-2 shrink-0 rounded-full bg-amber-500"
							title="Draft"
						/>
						<span className="sr-only">Draft</span>
					</>
				)}
				{item.external && <span className="sr-only">(opens in new tab)</span>}
			</Link>
		</li>
	);
}

/**
 * Mobile sidebar trigger button
 */
export function SidebarTrigger({ className }: { className?: string }) {
	const { setOpen } = useSidebar();

	return (
		<button
			type="button"
			className={cn(
				"rounded-xl border border-border/70 bg-background/80 p-2 hover:bg-accent md:hidden",
				className,
			)}
			onClick={() => setOpen(true)}
			aria-label="Open navigation menu"
		>
			<Menu className="h-5 w-5" />
		</button>
	);
}
