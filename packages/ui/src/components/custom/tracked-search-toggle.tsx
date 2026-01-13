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
	...props
}: ComponentProps<typeof LargeSearchToggle> & TrackedSearchProps) {
	const plausible = usePlausible();

	const handleClick = () => {
		plausible(trackingEvent);
	};

	return (
		<div onClick={handleClick}>
			<LargeSearchToggle {...props} />
		</div>
	);
}

export function TrackedSearchToggle({
	trackingEvent = "Search Open",
	...props
}: ComponentProps<typeof SearchToggle> & TrackedSearchProps) {
	const plausible = usePlausible();

	const handleClick = () => {
		plausible(trackingEvent);
	};

	return (
		<div onClick={handleClick}>
			<SearchToggle {...props} />
		</div>
	);
}
