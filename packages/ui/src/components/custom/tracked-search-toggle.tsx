// @ts-nocheck - Disabled for Fumadocs v16 migration while search toggle types stabilize
"use client";

import {
	LargeSearchToggle,
	SearchToggle,
} from "@ux-patterns/ui/components/custom/fumadocs-compat";
import { track } from "@ux-patterns/analytics/track";
import type { ComponentProps } from "react";

interface TrackedSearchProps {
	trackingEvent?: string;
}

export function TrackedLargeSearchToggle({
	trackingEvent = "Search Open",
	onClick,
	...props
}: ComponentProps<typeof LargeSearchToggle> & TrackedSearchProps) {

	const handleClick: ComponentProps<typeof LargeSearchToggle>["onClick"] = (
		event,
	) => {
		track(trackingEvent);
		onClick?.(event);
	};

	return <LargeSearchToggle {...props} onClick={handleClick} />;
}

export function TrackedSearchToggle({
	trackingEvent = "Search Open",
	onClick,
	...props
}: ComponentProps<typeof SearchToggle> & TrackedSearchProps) {

	const handleClick: ComponentProps<typeof SearchToggle>["onClick"] = (
		event,
	) => {
		track(trackingEvent);
		onClick?.(event);
	};

	return <SearchToggle {...props} onClick={handleClick} />;
}
