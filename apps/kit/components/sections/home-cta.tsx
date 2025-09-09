"use client";

import { Button } from "@ux-patterns/ui/components/shadcn/button";
import { ArrowRight, Code, Palette, Shield } from "lucide-react";
import Link from "next/link";
import { TRACKING_CLASSES } from "@/lib/tracking";

export const HomeCTA = () => {
	return (
		<div className="my-8 flex flex-col gap-10 justify-center items-center">
			<div className="flex gap-4">
				<Button asChild size="lg">
					<Link
						href="/docs"
						aria-label="Get started with UX Patterns"
						className={TRACKING_CLASSES.GET_STARTED_CLICK}
					>
						Get Started
						<ArrowRight className="h-4 w-4" />
					</Link>
				</Button>
				<Button asChild size="lg">
					<Link
						href="/docs/components/button"
						aria-label="Learn about UX components"
						className={`border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 ${TRACKING_CLASSES.VIEW_COMPONENT_CLICK}`}
					>
						Browse Components
						<ArrowRight className="h-4 w-4" />
					</Link>
				</Button>
			</div>

			<div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
				<div className="flex items-center gap-2">
					<Code className="h-4 w-4" />
					<span>React + TypeScript</span>
				</div>
				<div className="flex items-center gap-2">
					<Palette className="h-4 w-4" />
					<span>Tailwind CSS</span>
				</div>
				<div className="flex items-center gap-2">
					<Shield className="h-4 w-4" />
					<span>WCAG 2.2 Compliant</span>
				</div>
			</div>
		</div>
	);
};
