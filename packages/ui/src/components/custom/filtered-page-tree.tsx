"use client";

import {
	type SidebarComponents,
	SidebarItem,
	SidebarPageTree,
} from "fumadocs-ui/components/layout/sidebar";
import { useMemo } from "react";
import { getBadgeType } from "../../utils/pattern-status";
import { PatternBadge } from "./pattern-badge";

// Custom item component that adds badges
function CustomSidebarItem({ item, ...props }: any) {
	// Get badge if needed
	let badge = null;
	const metadata = (item as any)?.data;

	if (metadata && item.type === "page") {
		// Extract slug from item URL
		const slug = item.url?.replace(/^\/patterns\//, "").replace(/\/$/, "");

		// For now, skip git dates in the sidebar since we can't access them from the UI package
		// The badges will still show in related patterns cards where we can access git dates
		const badgeType = getBadgeType({
			status: metadata.status || "complete",
			gitCreatedAt: undefined,
			gitUpdatedAt: undefined,
			isMajorUpdate: undefined,
			createdAt: metadata.createdAt,
			updatedAt: metadata.updatedAt,
			publishedAt: metadata.publishedAt,
			lastMajorUpdate: metadata.lastMajorUpdate,
		});

		if (badgeType) {
			badge = (
				<PatternBadge variant={badgeType} className="ml-auto flex-shrink-0" />
			);
		}
	}

	// Don't override the default rendering - just add our badge
	// Pass through all props to preserve default behavior including icons
	if (!badge) {
		// No badge needed, use default rendering
		return <SidebarItem item={item} {...props} />;
	}

	// Add badge to the existing children
	return (
		<SidebarItem item={item} {...props}>
			{props.children ? (
				<div className="flex items-center justify-between w-full gap-2">
					<span className="flex-1 flex items-center gap-2">{props.children}</span>
					{badge}
				</div>
			) : (
				<>
					{/* Let Fumadocs render the icon and text normally */}
					{item.icon}
					<span className="flex-1">{item.name}</span>
					{badge}
				</>
			)}
		</SidebarItem>
	);
}

interface FilteredPageTreeProps {
	components?: Partial<SidebarComponents>;
}

export function FilteredPageTree({
	components: userComponents,
}: FilteredPageTreeProps) {
	// Enhance components to use our custom item
	const enhancedComponents = useMemo(() => {
		return {
			...userComponents,
			Item: CustomSidebarItem,
		} as Partial<SidebarComponents>;
	}, [userComponents]);

	return <SidebarPageTree components={enhancedComponents} />;
}
