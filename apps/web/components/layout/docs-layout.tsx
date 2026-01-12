"use client";

import { cn } from "@/lib/cn";
import type { PageTreeNode, TocItem } from "@/lib/content";
import { SidebarProvider } from "./sidebar-context";
import { Sidebar, SidebarTrigger } from "./sidebar";
import { Toc, TocWrapper } from "./toc";
import { Header } from "./header";
import { Badge } from "@ux-patterns/ui/components/shadcn/badge";
import type { ReactNode } from "react";

/**
 * Popularity badge configuration
 */
const popularityConfig = {
	low: {
		label: "Growing",
		icon: "📈",
		className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
	},
	medium: {
		label: "Popular",
		icon: "⭐",
		className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
	},
	high: {
		label: "Very Popular",
		icon: "🌟",
		className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
	},
	trending: {
		label: "Trending",
		icon: "🔥",
		className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
	},
} as const;

interface DocsLayoutProps {
	/** Page tree for sidebar navigation */
	tree: PageTreeNode[];
	/** Table of contents for the current page */
	toc?: TocItem[];
	/** Main page content */
	children: ReactNode;
	/** Sidebar header content (logo, title, etc.) */
	sidebarHeader?: ReactNode;
	/** Sidebar footer content */
	sidebarFooter?: ReactNode;
	/** GitHub stars component */
	githubStars?: ReactNode;
	/** Search toggle component */
	searchToggle?: ReactNode;
	/** Default expand level for sidebar folders */
	defaultOpenLevel?: number;
}

/**
 * Docs Layout Component
 *
 * Main layout for documentation pages with:
 * - Fixed header with navigation
 * - Sidebar with navigation tree
 * - Sticky table of contents
 * - Responsive design with mobile drawer
 */
export function DocsLayout({
	tree,
	toc,
	children,
	sidebarHeader,
	sidebarFooter,
	githubStars,
	searchToggle,
	defaultOpenLevel = 2,
}: DocsLayoutProps) {
	return (
		<SidebarProvider defaultOpenLevel={defaultOpenLevel}>
			<DocsLayoutInner
				tree={tree}
				toc={toc}
				sidebarHeader={sidebarHeader}
				sidebarFooter={sidebarFooter}
				githubStars={githubStars}
				searchToggle={searchToggle}
			>
				{children}
			</DocsLayoutInner>
		</SidebarProvider>
	);
}

function DocsLayoutInner({
	tree,
	toc,
	children,
	sidebarHeader,
	sidebarFooter,
	githubStars,
	searchToggle,
}: Omit<DocsLayoutProps, "defaultOpenLevel">) {
	return (
		<div className="relative min-h-screen flex flex-col">
			{/* Fixed Header */}
			<Header githubStars={githubStars} searchToggle={searchToggle} />

			{/* Container for sidebar + content */}
			<div className="container mx-auto px-4 md:px-6 flex flex-1">
				{/* Sidebar - sticky within container */}
				<aside className="hidden md:block w-64 shrink-0">
					<div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden">
						<Sidebar
							tree={tree}
							header={sidebarHeader}
							footer={sidebarFooter}
							variant="desktop"
						/>
					</div>
				</aside>

				{/* Main content area */}
				<div className="flex-1 min-w-0">
					{/* Mobile sidebar trigger bar */}
					<div className="sticky top-14 z-30 flex h-12 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
						<SidebarTrigger />
						<span className="text-sm font-medium text-muted-foreground">
							Navigation
						</span>
					</div>

					{/* Page content - TOC is rendered by the page component */}
					<main className="flex-1 min-w-0 px-4 py-8 md:px-8 lg:px-12">
						{children}
					</main>
				</div>
			</div>

			{/* Mobile Sidebar - fixed overlay */}
			<Sidebar
				tree={tree}
				header={sidebarHeader}
				footer={sidebarFooter}
				variant="mobile"
			/>
		</div>
	);
}

/**
 * Breadcrumb component for docs pages
 */
export function DocsBreadcrumb({
	items,
}: {
	items: { label: string; href?: string }[];
}) {
	return (
		<nav aria-label="Breadcrumb" className="mb-4">
			<ol className="flex items-center gap-2 text-sm text-muted-foreground">
				{items.map((item, index) => (
					<li key={index} className="flex items-center gap-2">
						{index > 0 && <span aria-hidden="true">/</span>}
						{item.href ? (
							<a
								href={item.href}
								className="hover:text-foreground transition-colors"
							>
								{item.label}
							</a>
						) : (
							<span className="text-foreground">{item.label}</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}

/**
 * Page header with title, description, and metadata
 */
export function DocsPageHeader({
	title,
	description,
	category,
	readTime,
	lastUpdated,
	aliases,
	popularity,
}: {
	title: string;
	description?: string;
	category?: string;
	readTime?: string;
	lastUpdated?: string;
	aliases?: string[];
	popularity?: "low" | "medium" | "high" | "trending";
}) {
	return (
		<header className="mb-8 pb-8 border-b">
			{category && (
				<p className="text-sm font-medium text-primary mb-2">{category}</p>
			)}
			<h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>

			{/* Aliases and popularity badge */}
			{(aliases?.length || popularity) && (
				<div className="mt-3 flex flex-wrap items-center gap-3">
					{aliases && aliases.length > 0 && (
						<p className="text-sm text-muted-foreground italic">
							Also called {aliases.join(", ")}
						</p>
					)}
					{popularity && (
						<Badge
							className={cn(
								"px-2 py-0.5 text-xs font-medium",
								popularityConfig[popularity].className
							)}
						>
							<span className="mr-1">{popularityConfig[popularity].icon}</span>
							{popularityConfig[popularity].label}
						</Badge>
					)}
				</div>
			)}

			{description && (
				<p className="mt-3 text-lg text-muted-foreground">{description}</p>
			)}
			{(readTime || lastUpdated) && (
				<div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
					{readTime && <span>{readTime}</span>}
					{lastUpdated && (
						<span>Last updated: {new Date(lastUpdated).toLocaleDateString()}</span>
					)}
				</div>
			)}
		</header>
	);
}
