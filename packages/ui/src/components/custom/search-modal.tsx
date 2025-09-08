"use client";

import {
	ArrowRightLeft,
	Eye,
	Folder,
	Monitor,
	Search,
	Smartphone,
	TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

// Define Entry type locally to avoid import issues
interface Entry {
	id: string;
	title: string;
	website: string;
	pattern: string;
	media: {
		type: "image" | "video";
		src: string;
	};
	verdict: "do" | "dont";
	tags?: string[];
	notes?: string;
	url?: string;
}

import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogTitle } from "../shadcn/dialog";

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
	entries: Entry[];
	patterns: string[];
}

type SearchView = "browse" | "search";

export function SearchModal({
	isOpen,
	onClose,
	entries,
	patterns,
}: SearchModalProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeView, setActiveView] = useState<SearchView>("browse");
	const [selectedCategory, setSelectedCategory] = useState("trending");

	// Reset state when modal opens/closes
	useEffect(() => {
		if (isOpen) {
			setSearchQuery("");
			setActiveView("browse");
			setSelectedCategory("trending");
		}
	}, [isOpen]);

	// Switch to search view when typing
	useEffect(() => {
		if (searchQuery.trim()) {
			setActiveView("search");
		} else {
			setActiveView("browse");
		}
	}, [searchQuery]);

	const handleEntryClick = (entry: Entry) => {
		onClose();
		// Navigate to entry detail - you might want to implement this
		window.location.href = `/?id=${entry.id}`;
	};

	const handlePatternClick = (pattern: string) => {
		onClose();
		window.location.href = `/explore/web/all/${encodeURIComponent(pattern)}`;
	};

	const categories = [
		{ id: "trending", label: "Trending", icon: TrendingUp },
		{ id: "categories", label: "Categories", icon: Folder },
		{ id: "screens", label: "Screens", icon: Monitor },
		{ id: "ui-elements", label: "UI Elements", icon: Eye },
		{ id: "flows", label: "Flows", icon: ArrowRightLeft },
	];

	const filteredEntries = entries.filter(
		(entry) =>
			entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			entry.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
			entry.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
			entry.tags?.some((tag: string) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase()),
			),
	);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="p-0 overflow-hidden bg-fd-card">
				<DialogTitle className="sr-only">Search UX Patterns</DialogTitle>

				<div className="flex h-full">
					{/* Left Sidebar - Only show in browse mode */}
					{activeView === "browse" && (
						<div className="w-64 border-r border-fd-border bg-fd-card/50 p-4">
							<div className="space-y-2">
								{categories.map((category) => {
									const Icon = category.icon;
									return (
										<button
											type="button"
											key={category.id}
											onClick={() => setSelectedCategory(category.id)}
											className={cn(
												"w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
												selectedCategory === category.id
													? "bg-fd-primary text-fd-primary-foreground"
													: "hover:bg-fd-muted text-fd-foreground",
											)}
										>
											<Icon className="w-4 h-4" />
											{category.label}
										</button>
									);
								})}
							</div>
						</div>
					)}

					{/* Main Content Area */}
					<div className="flex-1 flex flex-col">
						{/* Search Bar */}
						<div className="p-4 border-b border-fd-border">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fd-muted-foreground" />
								<input
									type="text"
									placeholder="Web Apps, Screens, UI Elements, Flows or Keywords..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-3 bg-fd-muted border border-fd-border rounded-lg text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary focus:border-transparent"
								/>
								{/* Device Icons */}
								<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
									<button
										type="button"
										className="p-1 hover:bg-fd-muted rounded"
									>
										<Monitor className="w-4 h-4 text-fd-muted-foreground" />
									</button>
									<button
										type="button"
										className="p-1 hover:bg-fd-muted rounded"
									>
										<Smartphone className="w-4 h-4 text-fd-muted-foreground" />
									</button>
								</div>
							</div>
						</div>

						{/* Content Area */}
						<div className="flex-1 overflow-auto p-4">
							{activeView === "browse" ? (
								<BrowseView
									selectedCategory={selectedCategory}
									entries={entries}
									patterns={patterns}
									onEntryClick={handleEntryClick}
									onPatternClick={handlePatternClick}
								/>
							) : (
								<SearchView
									searchQuery={searchQuery}
									entries={filteredEntries}
									patterns={patterns}
									onEntryClick={handleEntryClick}
									onPatternClick={handlePatternClick}
								/>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function BrowseView({
	selectedCategory,
	entries,
	patterns,
	onEntryClick: _onEntryClick,
	onPatternClick,
}: {
	selectedCategory: string;
	entries: Entry[];
	patterns: string[];
	onEntryClick: (entry: Entry) => void;
	onPatternClick: (pattern: string) => void;
}) {
	switch (selectedCategory) {
		case "trending":
			return (
				<div className="space-y-6">
					{/* App Icons */}
					<div className="flex items-center gap-4">
						{/* You can add app icons here */}
						<div className="w-8 h-8 bg-fd-muted rounded-lg flex items-center justify-center">
							<span className="text-xs font-bold">UX</span>
						</div>
						<div className="w-8 h-8 bg-fd-muted rounded-lg flex items-center justify-center">
							<span className="text-xs font-bold">UI</span>
						</div>
						<div className="w-8 h-8 bg-fd-muted rounded-lg flex items-center justify-center">
							<span className="text-xs font-bold">PAT</span>
						</div>
					</div>

					{/* Screens Section */}
					<div>
						<h3 className="text-sm font-semibold text-fd-foreground mb-3">
							Screens
						</h3>
						<div className="grid grid-cols-4 gap-3">
							{[
								"Signup",
								"Login",
								"Home",
								"Dashboard",
								"Checkout",
								"Error",
								"Search",
								"Filter",
							].map((screen) => (
								<button
									type="button"
									key={screen}
									onClick={() => onPatternClick(screen.toLowerCase())}
									className="p-3 bg-fd-muted hover:bg-fd-muted/80 rounded-lg text-sm font-medium text-fd-foreground transition-colors"
								>
									{screen}
								</button>
							))}
						</div>
					</div>

					{/* UI Elements Section */}
					<div>
						<h3 className="text-sm font-semibold text-fd-foreground mb-3">
							UI Elements
						</h3>
						<div className="flex flex-wrap gap-2">
							{[
								"Table",
								"Card",
								"Dialog",
								"Stepper",
								"Button",
								"Side Navigation",
								"Banner",
								"Progress Indicator",
							].map((element) => (
								<button
									type="button"
									key={element}
									onClick={() => onPatternClick(element.toLowerCase())}
									className="px-3 py-1.5 bg-fd-muted hover:bg-fd-muted/80 rounded-full text-sm font-medium text-fd-foreground transition-colors"
								>
									{element}
								</button>
							))}
						</div>
					</div>

					{/* Flows Section */}
					<div>
						<h3 className="text-sm font-semibold text-fd-foreground mb-3">
							Flows
						</h3>
						<div className="flex flex-wrap gap-2">
							{[
								"Onboarding",
								"Editing Profile",
								"Filtering & Sorting",
								"Browsing Tutorial",
							].map((flow) => (
								<button
									type="button"
									key={flow}
									onClick={() => onPatternClick(flow.toLowerCase())}
									className="px-3 py-1.5 bg-fd-muted hover:bg-fd-muted/80 rounded-full text-sm font-medium text-fd-foreground transition-colors"
								>
									{flow}
								</button>
							))}
						</div>
					</div>
				</div>
			);

		case "patterns":
			return (
				<div className="space-y-2">
					{patterns.map((pattern) => (
						<button
							type="button"
							key={pattern}
							onClick={() => onPatternClick(pattern)}
							className="w-full p-3 text-left hover:bg-fd-muted rounded-lg transition-colors"
						>
							<div className="font-medium text-fd-foreground">{pattern}</div>
							<div className="text-sm text-fd-muted-foreground">
								{entries.filter((e) => e.pattern === pattern).length} examples
							</div>
						</button>
					))}
				</div>
			);

		default:
			return (
				<div className="text-center py-8 text-fd-muted-foreground">
					Select a category to browse
				</div>
			);
	}
}

function SearchView({
	searchQuery,
	entries,
	patterns,
	onEntryClick,
	onPatternClick,
}: {
	searchQuery: string;
	entries: Entry[];
	patterns: string[];
	onEntryClick: (entry: Entry) => void;
	onPatternClick: (pattern: string) => void;
}) {
	const matchingPatterns = patterns.filter((pattern) =>
		pattern.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="space-y-4">
			{/* Primary Results */}
			{entries.length > 0 && (
				<div>
					{entries.slice(0, 3).map((entry) => (
						<button
							type="button"
							key={entry.id}
							onClick={() => onEntryClick(entry)}
							className="w-full p-4 text-left hover:bg-fd-muted rounded-lg transition-colors border border-fd-border"
						>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-fd-muted rounded-lg flex items-center justify-center">
									<span className="text-xs font-bold">
										{entry.website.charAt(0).toUpperCase()}
									</span>
								</div>
								<div>
									<div className="font-medium text-fd-foreground">
										{entry.title}
									</div>
									<div className="text-sm text-fd-muted-foreground">
										{entry.notes}
									</div>
								</div>
							</div>
						</button>
					))}
				</div>
			)}

			{/* Other Results */}
			{matchingPatterns.length > 0 && (
				<div>
					<h3 className="text-sm font-semibold text-fd-foreground mb-2">
						Other
					</h3>
					<div className="space-y-2">
						{matchingPatterns.map((pattern) => (
							<button
								type="button"
								key={pattern}
								onClick={() => onPatternClick(pattern)}
								className="w-full p-3 text-left hover:bg-fd-muted rounded-lg transition-colors"
							>
								<div className="flex items-center gap-3">
									<div className="w-6 h-6 bg-fd-muted rounded flex items-center justify-center">
										<span className="text-xs">P</span>
									</div>
									<div>
										<div className="font-medium text-fd-foreground">
											{pattern}
										</div>
										<div className="text-sm text-fd-muted-foreground">
											Pattern
										</div>
									</div>
								</div>
							</button>
						))}
					</div>
				</div>
			)}

			{/* No Results */}
			{entries.length === 0 && matchingPatterns.length === 0 && (
				<div className="text-center py-8">
					<div className="text-fd-muted-foreground mb-2">No results found</div>
					<button type="button" className="text-fd-primary hover:underline">
						Request pattern
					</button>
				</div>
			)}
		</div>
	);
}
