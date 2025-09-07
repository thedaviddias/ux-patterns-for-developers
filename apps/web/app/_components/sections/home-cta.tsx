"use client";

import { TRACKING_CLASSES } from "@app/_utils/tracking";
import { ArrowRight } from "lucide-react";
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
				Pattern Guide
			</LinkCustom>
			<LinkCustom
				href="https://kit.uxpatterns.dev"
				aria-label="Explore the UI Kit component library"
				className={`bg-primary text-primary-foreground hover:bg-primary/90 !no-underline ${TRACKING_CLASSES.EXPLORE_UI_KIT_CLICK}`}
				variant="default"
			>
				Explore UI Kit
			</LinkCustom>
		</div>
	);
};
