"use client";

import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTrigger,
} from "@ux-patterns/ui/components/shadcn/drawer";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface TagFilterProps {
	tags: string[];
	selectedTag: string;
	tagCounts?: Record<string, number>;
}

interface DesktopTagFilterProps {
	tags: string[];
	selectedTag: string;
	tagCounts?: Record<string, number>;
	onTagClick: (tag: string) => void;
}

interface MobileTagFilterProps {
	tags: string[];
	selectedTag: string;
	tagCounts?: Record<string, number>;
	onTagClick: (tag: string) => void;
}

function DesktopTagFilter({
	tags,
	selectedTag,
	tagCounts,
	onTagClick,
}: DesktopTagFilterProps) {
	return (
		<div className="hidden md:flex flex-wrap gap-2">
			{tags.map((tag) => (
				<button
					type="button"
					key={tag}
					onClick={() => onTagClick(tag)}
					className={`h-8 flex items-center px-1 pl-3 rounded-lg cursor-pointer border text-sm transition-colors ${
						selectedTag === tag
							? "border-primary bg-primary text-primary-foreground"
							: "border-border hover:bg-muted"
					}`}
				>
					<span>{tag}</span>
					{tagCounts?.[tag] && (
						<span
							className={`ml-2 text-xs border rounded-md h-6 min-w-6 font-medium flex items-center justify-center ${
								selectedTag === tag
									? "border-border/40 dark:border-primary-foreground bg-background text-primary"
									: "border-border dark:border-border"
							}`}
						>
							{tagCounts[tag]}
						</span>
					)}
				</button>
			))}
		</div>
	);
}

function MobileTagFilter({
	tags,
	selectedTag,
	tagCounts,
	onTagClick,
}: MobileTagFilterProps) {
	return (
		<Drawer>
			<DrawerTrigger className="md:hidden w-full flex items-center justify-between px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
				<span className="capitalize text-sm font-medium">{selectedTag}</span>
				<ChevronDown className="h-4 w-4" />
			</DrawerTrigger>

			<DrawerContent className="md:hidden">
				<DrawerHeader>
					<h3 className="font-semibold text-sm">Select Category</h3>
				</DrawerHeader>

				<div>
					<div className="space-y-2">
						{tags.map((tag) => (
							<button
								type="button"
								key={tag}
								onClick={() => onTagClick(tag)}
								className="w-full flex items-center justify-between font-medium cursor-pointer text-sm transition-colors"
							>
								<span
									className={`w-full flex items-center justify-between font-medium cursor-pointer text-sm transition-colors ${
										selectedTag === tag
											? "underline underline-offset-4 text-primary"
											: "text-muted-foreground"
									}`}
								>
									{tag}
								</span>
								{tagCounts?.[tag] && (
									<span className="flex-shrink-0 ml-2 border border-border rounded-md h-6 min-w-6 flex items-center justify-center">
										{tagCounts[tag]}
									</span>
								)}
							</button>
						))}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

export function TagFilter({ tags, selectedTag, tagCounts }: TagFilterProps) {
	const router = useRouter();
	const pathname = usePathname();

	const handleTagClick = (tag: string) => {
		const params = new URLSearchParams();
		if (tag !== "All") {
			params.set("tag", tag);
		}
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<>
			<DesktopTagFilter
				tags={tags}
				selectedTag={selectedTag}
				tagCounts={tagCounts}
				onTagClick={handleTagClick}
			/>
			<MobileTagFilter
				tags={tags}
				selectedTag={selectedTag}
				tagCounts={tagCounts}
				onTagClick={handleTagClick}
			/>
		</>
	);
}
