// @ts-nocheck - Disabled for Fumadocs v16 migration while search toggle types stabilize
"use client";

import {
	LargeSearchToggle,
	SearchToggle,
} from "fumadocs-ui/layouts/shared/search-toggle";
import { usePlausible } from "next-plausible";
import type { ComponentProps } from "react";

interface TrackedSearchProps {
	trackingEvent?: string;
}

export function TrackedLargeSearchToggle({
	trackingEvent = "Search Open",
	onClick,
	...props
}: ComponentProps<typeof LargeSearchToggle> & TrackedSearchProps) {
	const plausible = usePlausible();

	const handleClick: ComponentProps<typeof LargeSearchToggle>["onClick"] = (
		event,
	) => {
		plausible(trackingEvent);
		onClick?.(event);
	};

	return <LargeSearchToggle {...props} onClick={handleClick} />;
}

export function TrackedSearchToggle({
	trackingEvent = "Search Open",
	onClick,
	...props
}: ComponentProps<typeof SearchToggle> & TrackedSearchProps) {
	const plausible = usePlausible();

	const handleClick: ComponentProps<typeof SearchToggle>["onClick"] = (
		event,
	) => {
		plausible(trackingEvent);
		onClick?.(event);
	};

	return <SearchToggle {...props} onClick={handleClick} />;
}
