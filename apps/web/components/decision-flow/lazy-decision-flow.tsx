"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { DecisionFlowProps } from "./types";

// Lazy load the DecisionFlow component
const DecisionFlow = dynamic(
	() => import("./index").then((mod) => ({ default: mod.DecisionFlow })),
	{
		loading: () => (
			<div className="w-full h-[800px] flex items-center justify-center border border-neutral-200 dark:border-neutral-800 rounded-xl">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-sm text-muted-foreground">
						Loading interactive diagram...
					</p>
				</div>
			</div>
		),
		ssr: false, // Disable SSR for this component since it uses client-side libraries
	},
);

export function LazyDecisionFlow(props: DecisionFlowProps) {
	return (
		<Suspense
			fallback={
				<div className="w-full h-[800px] flex items-center justify-center border border-neutral-200 dark:border-neutral-800 rounded-xl">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-sm text-muted-foreground">
							Loading interactive diagram...
						</p>
					</div>
				</div>
			}
		>
			<DecisionFlow {...props} />
		</Suspense>
	);
}
