"use client";

import * as Select from "@radix-ui/react-select";
import {
	CheckCircle,
	Filter,
	Monitor,
	Smartphone,
	XCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { cn } from "@/lib/utils";
import { FilterChip } from "./filter-chip";

interface FiltersProps {
	patterns: string[];
	className?: string;
	variant?: "homepage" | "search";
}

export function Filters({
	patterns,
	className,
	variant = "search",
}: FiltersProps) {
	const pathname = usePathname();

	// Detect current platform, quality, and pattern from URL path
	const getCurrentPlatform = () => {
		if (pathname.startsWith("/explore/web")) return "web";
		if (pathname.startsWith("/explore/mobile")) return "mobile";
		return "all";
	};

	const getCurrentQuality = () => {
		const pathParts = pathname.split("/");
		if (pathParts.length >= 4 && ["do", "dont"].includes(pathParts[3])) {
			return pathParts[3];
		}
		return "all";
	};

	const getCurrentPattern = () => {
		const pathParts = pathname.split("/");
		if (pathParts.length >= 5 && pathParts[4]) {
			return pathParts[4];
		}
		return "";
	};

	const [filters, setFilters] = useQueryStates({
		platform: parseAsStringEnum(["all", "web", "mobile"]).withDefault(
			getCurrentPlatform(), // Use URL-based platform detection for all pages
		),
		type: parseAsStringEnum(["all", "do", "dont"]).withDefault(
			getCurrentQuality(), // Use URL-based quality detection
		),
		pattern: parseAsString.withDefault(
			getCurrentPattern(), // Use URL-based pattern detection
		),
		search: parseAsString.withDefault(""),
		view: parseAsString.withDefault(""), // For modal state
	});

	return (
		<div
			className={cn(
				"sticky top-0 z-[1] bg-fd-card border-b border-fd-border py-4",
				className,
			)}
		>
			<div className="container-responsive">
				{/* Active Filter Chips - Only show on search pages, exclude platform and quality */}
				{variant === "search" && filters.pattern && (
					<div className="mb-4 flex flex-wrap gap-2">
						{filters.pattern && (
							<FilterChip
								label={filters.pattern}
								onRemove={() => setFilters({ pattern: "" })}
							/>
						)}
					</div>
				)}

				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
					<div className="flex flex-wrap gap-3 items-center">
						{/* Platform Selection - Radio button behavior for clean URLs */}
						<fieldset className="flex items-center gap-1 bg-fd-muted rounded-lg p-1">
							<legend className="sr-only">Select platform to view</legend>
							<label className="cursor-pointer">
								<input
									type="radio"
									name="platform"
									value="all"
									checked={filters.platform === "all"}
									onChange={() => {
										window.location.href = "/";
									}}
									className="sr-only"
								/>
								<div
									className={cn(
										"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
										"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
										filters.platform === "all"
											? "bg-fd-card text-fd-foreground shadow-sm"
											: "text-fd-muted-foreground hover:text-fd-foreground",
									)}
								>
									All
								</div>
							</label>

							<label className="cursor-pointer">
								<input
									type="radio"
									name="platform"
									value="web"
									checked={filters.platform === "web"}
									onChange={() => {
										window.location.href = "/explore/web";
									}}
									className="sr-only"
								/>
								<div
									className={cn(
										"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
										"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
										filters.platform === "web"
											? "bg-fd-card text-fd-foreground shadow-sm"
											: "text-fd-muted-foreground hover:text-fd-foreground",
									)}
								>
									<Monitor className="w-4 h-4" />
									Web
								</div>
							</label>

							<label className="cursor-pointer">
								<input
									type="radio"
									name="platform"
									value="mobile"
									checked={filters.platform === "mobile"}
									onChange={() => {
										window.location.href = "/explore/mobile";
									}}
									className="sr-only"
								/>
								<div
									className={cn(
										"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
										"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
										filters.platform === "mobile"
											? "bg-fd-card text-fd-foreground shadow-sm"
											: "text-fd-muted-foreground hover:text-fd-foreground",
									)}
								>
									<Smartphone className="w-4 h-4" />
									Mobile
								</div>
							</label>
						</fieldset>

						{/* Quality Selection - Only show on search pages */}
						{variant === "search" && (
							<fieldset className="flex items-center gap-1 bg-fd-muted rounded-lg p-1">
								<legend className="sr-only">Select quality to view</legend>
								<label className="cursor-pointer">
									<input
										type="radio"
										name="quality"
										value="all"
										checked={filters.type === "all"}
										onChange={() => {
											const currentPlatform = getCurrentPlatform();
											const currentPattern = getCurrentPattern();
											if (currentPattern) {
												window.location.href = `/explore/${currentPlatform}/all/${currentPattern}`;
											} else {
												window.location.href = `/explore/${currentPlatform}`;
											}
										}}
										className="sr-only"
									/>
									<div
										className={cn(
											"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
											"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
											filters.type === "all"
												? "bg-fd-card text-fd-foreground shadow-sm"
												: "text-fd-muted-foreground hover:text-fd-foreground",
										)}
									>
										All
									</div>
								</label>

								<label className="cursor-pointer">
									<input
										type="radio"
										name="quality"
										value="do"
										checked={filters.type === "do"}
										onChange={() => {
											const currentPlatform = getCurrentPlatform();
											const currentPattern = getCurrentPattern();
											if (currentPattern) {
												window.location.href = `/explore/${currentPlatform}/do/${currentPattern}`;
											} else {
												window.location.href = `/explore/${currentPlatform}/do`;
											}
										}}
										className="sr-only"
									/>
									<div
										className={cn(
											"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
											"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
											filters.type === "do"
												? "bg-fd-card text-fd-foreground shadow-sm"
												: "text-fd-muted-foreground hover:text-fd-foreground",
										)}
									>
										<CheckCircle className="w-4 h-4 text-green-600" />
										Do
									</div>
								</label>

								<label className="cursor-pointer">
									<input
										type="radio"
										name="quality"
										value="dont"
										checked={filters.type === "dont"}
										onChange={() => {
											const currentPlatform = getCurrentPlatform();
											const currentPattern = getCurrentPattern();
											if (currentPattern) {
												window.location.href = `/explore/${currentPlatform}/dont/${currentPattern}`;
											} else {
												window.location.href = `/explore/${currentPlatform}/dont`;
											}
										}}
										className="sr-only"
									/>
									<div
										className={cn(
											"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
											"focus-within:outline-none focus-within:ring-2 focus-within:ring-fd-primary",
											filters.type === "dont"
												? "bg-fd-card text-fd-foreground shadow-sm"
												: "text-fd-muted-foreground hover:text-fd-foreground",
										)}
									>
										<XCircle className="w-4 h-4 text-red-600" />
										Don't
									</div>
								</label>
							</fieldset>
						)}

						{/* Pattern Select - Only show on search pages */}
						{variant === "search" && (
							<Select.Root
								value={filters.pattern || ""}
								onValueChange={(value) => {
									const currentPlatform = getCurrentPlatform();
									const currentQuality = getCurrentQuality();
									if (value === "all") {
										// Remove pattern from URL
										if (currentQuality !== "all") {
											window.location.href = `/explore/${currentPlatform}/${currentQuality}`;
										} else {
											window.location.href = `/explore/${currentPlatform}`;
										}
									} else {
										// Add pattern to URL
										if (currentQuality !== "all") {
											window.location.href = `/explore/${currentPlatform}/${currentQuality}/${value}`;
										} else {
											window.location.href = `/explore/${currentPlatform}/all/${value}`;
										}
									}
								}}
							>
								<Select.Trigger className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
									<Filter className="w-4 h-4" />
									<Select.Value placeholder="All Patterns" />
								</Select.Trigger>

								<Select.Portal>
									<Select.Content className="bg-white border border-gray-200 rounded-lg shadow-lg z-[1]">
										<Select.Viewport className="p-1">
											<Select.Item
												value="all"
												className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:outline-none"
											>
												<Select.ItemText>All Patterns</Select.ItemText>
											</Select.Item>
											{patterns.map((pattern) => (
												<Select.Item
													key={pattern}
													value={pattern}
													className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:outline-none"
												>
													<Select.ItemText>{pattern}</Select.ItemText>
												</Select.Item>
											))}
										</Select.Viewport>
									</Select.Content>
								</Select.Portal>
							</Select.Root>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
