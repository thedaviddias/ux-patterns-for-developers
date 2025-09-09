"use client";

import { ArrowRight } from "lucide-react";
import { TRACKING_CLASSES } from "@/utils/tracking";
import { LinkCustom } from "../link-custom";

export const HomeCTA = () => {
	return (
		<div className="my-8 flex justify-center gap-4">
			<LinkCustom
				href="/patterns/getting-started"
				aria-label="Get started with UX Patterns"
				className={TRACKING_CLASSES.GET_STARTED_CLICK}
				variant="neutral"
			>
				Get Started
				<ArrowRight className="h-4 w-4" />
			</LinkCustom>
			<LinkCustom
				href="/pattern-guide"
				aria-label="Learn about UX patterns"
				className={`border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 ${TRACKING_CLASSES.PATTERN_GUIDE_CLICK}`}
				variant="outline"
			>
				Browse Patterns
			</LinkCustom>
		</div>
	);
};
