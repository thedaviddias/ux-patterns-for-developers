"use client";

import type { ReactNode } from "react";
import type { PageTreeNode, TocItem } from "@/lib/content";
import { PatternStats } from "../pattern-stats";
import { Header } from "./header";
import { Sidebar, SidebarTrigger } from "./sidebar";
import { SidebarProvider } from "./sidebar-context";

const docsDateFormatter = new Intl.DateTimeFormat("en-US", {
	timeZone: "UTC",
	year: "numeric",
	month: "short",
	day: "numeric",
});

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
	children,
	sidebarHeader,
	sidebarFooter,
	githubStars,
	searchToggle,
}: Omit<DocsLayoutProps, "defaultOpenLevel" | "toc">) {
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
					<li
						key={[item.href ?? "current", item.label].join(":")}
						className="flex items-center gap-2"
					>
						{index > 0 && <span aria-hidden="true">/</span>}
						{item.href ? (
							<a
								href={item.href}
								className="hover:text-foreground transition-colors"
							>
								{item.label}
							</a>
						) : (
							<span
								className="text-foreground"
								aria-current={index === items.length - 1 ? "page" : undefined}
							>
								{item.label}
							</span>
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
		<header className="mb-4">
			{category && (
				<p className="text-sm font-medium text-primary mb-2">{category}</p>
			)}
			<h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>

			{aliases && aliases.length > 0 && (
				<div className="mt-3 flex flex-wrap items-center gap-3">
					<p className="text-sm text-muted-foreground italic">
						Also called {aliases.join(", ")}
					</p>
				</div>
			)}

			{description && (
				<p className="mt-3 text-lg text-muted-foreground">{description}</p>
			)}
			{(readTime || lastUpdated || popularity) && (
				<div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
					<PatternStats
						mode="inline"
						popularity={popularity}
						className="mb-0 text-sm text-muted-foreground dark:text-muted-foreground"
					/>
					{readTime && <span>{readTime}</span>}
					{lastUpdated && (
						<span>
							Last updated: {docsDateFormatter.format(new Date(lastUpdated))}
						</span>
					)}
				</div>
			)}
		</header>
	);
}
