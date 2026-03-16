"use client";

import { track } from "@ux-patterns/analytics/track";
import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { TRACKING_EVENTS } from "@/lib/tracking";

export function HeroCta() {
	return (
		<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
			<Link
				href="/patterns"
				className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-6 py-3.5 text-base font-semibold text-background transition-all duration-200 hover:bg-foreground/92"
				onClick={() => track(TRACKING_EVENTS.BROWSE_PATTERNS_CLICK)}
			>
				Browse Patterns
				<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
			</Link>
			<Link
				href="/pattern-guide"
				className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background/70 px-6 py-3.5 text-base font-semibold text-foreground backdrop-blur transition-colors hover:bg-card"
			>
				Open Decision Guides
				<Compass className="h-4 w-4" />
			</Link>
		</div>
	);
}
