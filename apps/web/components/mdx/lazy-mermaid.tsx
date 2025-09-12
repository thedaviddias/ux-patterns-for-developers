"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load the Mermaid component
const Mermaid = dynamic(
	() => import("./mermaid").then((mod) => ({ default: mod.Mermaid })),
	{
		loading: () => (
			<div className="flex items-center justify-center p-8 border border-neutral-200 dark:border-neutral-800 rounded-lg">
				<div className="text-center">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
					<p className="text-sm text-muted-foreground">Loading diagram...</p>
				</div>
			</div>
		),
		ssr: false, // Disable SSR since Mermaid needs client-side rendering
	},
);

interface LazyMermaidProps {
	chart: string;
}

export function LazyMermaid({ chart }: LazyMermaidProps) {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center p-8 border border-neutral-200 dark:border-neutral-800 rounded-lg">
					<div className="text-center">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
						<p className="text-sm text-muted-foreground">Loading diagram...</p>
					</div>
				</div>
			}
		>
			<Mermaid chart={chart} />
		</Suspense>
	);
}
