"use client";

import { cn } from "@/lib/cn";
import type { PageTreeNode, PageTreeFolder, PageTreeItem } from "@/lib/content";
import { useSidebar } from "./sidebar-context";
import { ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type KeyboardEvent,
	type ReactNode,
} from "react";

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
export function Sidebar({ tree, header, footer, variant = "desktop" }: SidebarProps) {
	const { open, setOpen, scrollPosition, setScrollPosition } =
		useSidebar();
	const scrollRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	// Restore scroll position on mount
	useEffect(() => {
		if (scrollRef.current && scrollPosition > 0) {
			scrollRef.current.scrollTop = scrollPosition;
		}
	}, [scrollPosition]);

	// Save scroll position on scroll
	const handleScroll = useCallback(() => {
		if (scrollRef.current) {
			setScrollPosition(scrollRef.current.scrollTop);
		}
	}, [setScrollPosition]);

	// Close mobile sidebar on navigation
	useEffect(() => {
		if (variant === "mobile") {
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
			<div className="flex h-full flex-col border-r border-border">
				{/* Navigation */}
				<nav
					ref={scrollRef}
					onScroll={handleScroll}
					className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4"
					aria-label="Documentation navigation"
				>
					<SidebarTree nodes={tree} level={0} />
				</nav>

				{/* Footer */}
				{footer && (
					<div className="border-t px-4 py-3">{footer}</div>
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
					className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
					onClick={() => setOpen(false)}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-72 border-r border-border bg-background transition-transform duration-300 ease-in-out",
					open ? "translate-x-0" : "-translate-x-full"
				)}
			>
				<div className="flex h-full flex-col">
					{/* Mobile header with close button */}
					<div className="flex h-12 items-center justify-between border-b px-4">
						<span className="font-semibold">Navigation</span>
						<button
							className="rounded-md p-1.5 hover:bg-accent"
							onClick={() => setOpen(false)}
							aria-label="Close sidebar"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Navigation */}
					<nav
						ref={scrollRef}
						onScroll={handleScroll}
						className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4"
						aria-label="Documentation navigation"
					>
						<SidebarTree nodes={tree} level={0} />
					</nav>

					{/* Footer */}
					{footer && (
						<div className="border-t px-4 py-3">{footer}</div>
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
		<ul className="space-y-1" role="tree" aria-label={level === 0 ? "Navigation" : undefined}>
			{nodes.map((node, index) => (
				<SidebarNode key={index} node={node} level={level} />
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
			<li className="pt-4 pb-1 first:pt-0" role="separator">
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
	const { expandedPaths, togglePath, expandPath } = useSidebar();
	const pathname = usePathname();
	const folderPath = folder.index?.url || folder.name;
	const isExpanded = expandedPaths.has(folderPath);
	const buttonRef = useRef<HTMLButtonElement>(null);

	// Auto-expand if current path is within this folder
	const isActive = folder.index?.url === pathname;
	const hasActiveChild = folder.children.some((child) => {
		if (child.type === "page") return child.url === pathname;
		if (child.type === "folder") {
			return child.index?.url === pathname ||
				child.children.some((c) => c.type === "page" && c.url === pathname);
		}
		return false;
	});

	// Auto-expand on first render:
	// - Level 0 folders are expanded by default
	// - Any folder containing the active page is expanded
	useEffect(() => {
		const shouldAutoExpand = level === 0 || isActive || hasActiveChild;
		if (shouldAutoExpand) {
			expandPath(folderPath);
		}
	// Only run on mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		<li role="treeitem" aria-expanded={isExpanded}>
			<div className="flex items-center">
				<button
					ref={buttonRef}
					onClick={() => togglePath(folderPath)}
					onKeyDown={handleKeyDown}
					className={cn(
						"flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
						"hover:bg-accent hover:text-accent-foreground",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						(isActive || hasActiveChild) && "text-primary font-medium"
					)}
					style={{ paddingLeft: `${level * 12 + 8}px` }}
					aria-label={`${folder.name}, ${isExpanded ? "expanded" : "collapsed"}`}
				>
					<ChevronRight
						className={cn(
							"h-4 w-4 shrink-0 transition-transform duration-200",
							isExpanded && "rotate-90"
						)}
					/>
					{folder.icon}
					<span className="line-clamp-2">{folder.name}</span>
				</button>
			</div>

			{isExpanded && (
				<ul className="mt-1" role="group">
					{/* Folder children */}
					{folder.children.map((child, index) => (
						<SidebarNode key={index} node={child} level={level + 1} />
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
		<li role="treeitem">
			<Link
				ref={linkRef}
				href={item.url}
				onKeyDown={handleKeyDown}
				className={cn(
					"flex items-start gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
					"hover:bg-accent hover:text-accent-foreground",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					isActive
						? "bg-primary/10 text-primary font-medium"
						: "text-muted-foreground"
				)}
				style={{ paddingLeft: `${level * 12 + 8}px` }}
				aria-current={isActive ? "page" : undefined}
			>
				{item.icon}
				<span className="line-clamp-2 flex-1">{item.name}</span>
				{item.draft && (
					<span
						className="h-2 w-2 shrink-0 rounded-full bg-amber-500"
						title="Draft"
						aria-label="Draft"
					/>
				)}
				{item.external && (
					<span className="sr-only">(opens in new tab)</span>
				)}
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
			className={cn(
				"rounded-md p-2 hover:bg-accent md:hidden",
				className
			)}
			onClick={() => setOpen(true)}
			aria-label="Open navigation menu"
		>
			<Menu className="h-5 w-5" />
		</button>
	);
}
